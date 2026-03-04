import { useState, useCallback } from 'react';

export type GamePhase = 'START' | 'PICK_OWN' | 'ELIMINATION' | 'OFFER' | 'FINAL_CHOICE' | 'GAME_OVER';

export interface Box {
  id: number;
  value: number;
  isOpened: boolean;
}

export const BOX_VALUES = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750,
  1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000
];

const ROUNDS = [6, 5, 4, 3, 2, 1, 1, 1, 1, 1];

export const useGameLogic = () => {
  const [phase, setPhase] = useState<GamePhase>('START');
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [playerBoxId, setPlayerBoxId] = useState<number | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [boxesToOpenThisRound, setBoxesToOpenThisRound] = useState(0);
  const [offer, setOffer] = useState<number | null>(null);
  const [winnings, setWinnings] = useState<number | null>(null);
  const [openedBoxValues, setOpenedBoxValues] = useState<number[]>([]);

  const startGame = useCallback(() => {
    // Shuffle values
    const shuffledValues = [...BOX_VALUES].sort(() => Math.random() - 0.5);
    const newBoxes = Array.from({ length: 26 }).map((_, i) => ({
      id: i + 1,
      value: shuffledValues[i],
      isOpened: false,
    }));

    setBoxes(newBoxes);
    setPhase('PICK_OWN');
    setPlayerBoxId(null);
    setRoundIndex(0);
    setBoxesToOpenThisRound(0);
    setOffer(null);
    setWinnings(null);
    setOpenedBoxValues([]);
  }, []);

  const calculateOffer = useCallback((currentBoxes: Box[], currentRoundIndex: number) => {
    const unopened = currentBoxes.filter(b => !b.isOpened);
    const sum = unopened.reduce((acc, box) => acc + box.value, 0);
    const average = sum / unopened.length;

    // Round factor starts around 0.1 and grows to nearer 1.0
    const factor = 0.15 + (currentRoundIndex * 0.08);
    let calculatedOffer = average * factor;

    // Cap at a reasonable percentage of average and minimum of $1
    if (calculatedOffer > average * 0.9) calculatedOffer = average * 0.9;
    if (calculatedOffer < 1 && sum > 0) calculatedOffer = 1;

    setOffer(Math.round(calculatedOffer));
  }, []);

  const handleBoxClick = useCallback((id: number) => {
    if (phase === 'PICK_OWN') {
      setPlayerBoxId(id);
      setPhase('ELIMINATION');
      setBoxesToOpenThisRound(ROUNDS[0]);
    } else if (phase === 'ELIMINATION') {
      if (id === playerBoxId) return;

      const boxIndex = boxes.findIndex(b => b.id === id);
      if (boxIndex === -1 || boxes[boxIndex].isOpened) return;

      const newBoxes = [...boxes];
      newBoxes[boxIndex] = { ...newBoxes[boxIndex], isOpened: true };

      setBoxes(newBoxes);
      setOpenedBoxValues(prev => [...prev, newBoxes[boxIndex].value]);

      const newBoxesToOpen = boxesToOpenThisRound - 1;
      setBoxesToOpenThisRound(newBoxesToOpen);

      if (newBoxesToOpen <= 0) {
        const unopenedCount = newBoxes.filter(b => !b.isOpened).length;
        if (unopenedCount === 2) {
          // Player box + 1 on board
          setPhase('FINAL_CHOICE');
        } else {
          setPhase('OFFER');
          calculateOffer(newBoxes, roundIndex);
        }
      }
    }
  }, [phase, playerBoxId, boxes, boxesToOpenThisRound, roundIndex, calculateOffer]);

  const handleDealResponse = useCallback((accepted: boolean) => {
    if (accepted && offer !== null) {
      setWinnings(offer);
      setPhase('GAME_OVER');
      setBoxes(prev => prev.map(b => b.id === playerBoxId ? { ...b, isOpened: true } : b));
    } else {
      // Advance to next round
      const nextRoundIndex = roundIndex + 1;
      setRoundIndex(nextRoundIndex);
      setBoxesToOpenThisRound(ROUNDS[nextRoundIndex] || 1);
      setPhase('ELIMINATION');
      setOffer(null);
    }
  }, [offer, roundIndex, playerBoxId]);

  const handleFinalChoice = useCallback((swap: boolean) => {
    const unopened = boxes.filter(b => !b.isOpened);
    const playerBox = unopened.find(b => b.id === playerBoxId);
    const otherBox = unopened.find(b => b.id !== playerBoxId);

    if (swap && otherBox) {
      setWinnings(otherBox.value);
    } else if (playerBox) {
      setWinnings(playerBox.value);
    }
    setPhase('GAME_OVER');
  }, [boxes, playerBoxId]);

  return {
    phase,
    boxes,
    playerBoxId,
    boxesToOpenThisRound,
    offer,
    winnings,
    openedBoxValues,
    startGame,
    handleBoxClick,
    handleDealResponse,
    handleFinalChoice,
    roundIndex
  };
};
