import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import { useGameLogic, BOX_VALUES } from './hooks/useGameLogic';
import { Board } from './components/Board';
import { Tracker } from './components/Tracker';
import { StatusPanel } from './components/StatusPanel';
import { OfferModal } from './components/OfferModal';
import { GameOverScreen } from './components/GameOverScreen';

export default function App() {
  const {
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
    handleFinalChoice
  } = useGameLogic();

  useEffect(() => {
    startGame();
  }, [startGame]);

  const leftValues = BOX_VALUES.slice(0, 13);
  const rightValues = BOX_VALUES.slice(13, 26);

  useEffect(() => {
    if (phase === 'FINAL_CHOICE') {
      Alert.alert(
        "Final Choice",
        "There are just two boxes left. Do you want to SWAP your box?",
        [
          { text: "Keep Mine", onPress: () => handleFinalChoice(false), style: 'cancel' },
          { text: "Swap", onPress: () => handleFinalChoice(true), style: 'default' },
        ],
        { cancelable: false }
      );
    }
  }, [phase, handleFinalChoice]);

  // Determine if the player took the banker's deal (offer exists and game is over)
  const tookDeal = phase === 'GAME_OVER' && offer !== null;
  const playerBox = boxes.find(b => b.id === playerBoxId);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SEALED FORTUNE</Text>
        {playerBoxId && (
          <View style={styles.playerBoxContainer}>
            <Text style={styles.playerBoxLabel}>YOUR BOX:</Text>
            <View style={styles.playerBoxIcon}>
              <View style={styles.miniHandle} />
              <View style={[styles.miniStripe, { left: '25%' }]} />
              <View style={[styles.miniStripe, { left: '75%' }]} />
              <Text style={styles.playerBoxNumber}>{playerBoxId}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Main Game Area */}
      <View style={styles.gameArea}>
        <View style={styles.trackerColumn}>
          <Tracker values={leftValues} openedValues={openedBoxValues} colorTheme="blue" />
        </View>

        <View style={styles.boardColumn}>
          <Board
            boxes={boxes}
            onBoxPress={handleBoxClick}
            playerBoxId={playerBoxId}
            phase={phase}
          />
        </View>

        <View style={styles.trackerColumn}>
          <Tracker values={rightValues} openedValues={openedBoxValues} colorTheme="red" />
        </View>
      </View>

      {/* Footer / Status */}
      <StatusPanel phase={phase} boxesToOpen={boxesToOpenThisRound} />

      {/* Modals */}
      <OfferModal
        visible={phase === 'OFFER'}
        offer={offer}
        onDeal={() => handleDealResponse(true)}
        onNoDeal={() => handleDealResponse(false)}
      />

      {/* ── Game Over: Dedicated animated screen ── */}
      {phase === 'GAME_OVER' && winnings !== null && (
        <GameOverScreen
          winnings={winnings}
          playerBoxValue={playerBox ? playerBox.value : null}
          tookDeal={tookDeal}
          onPlayAgain={startGame}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  playerBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerBoxLabel: {
    color: '#AAA',
    fontSize: 12,
    marginRight: 5,
  },
  playerBoxIcon: {
    width: 36,
    height: 28,
    backgroundColor: '#BCBCBC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#00FF00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  playerBoxNumber: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    zIndex: 3,
  },
  miniHandle: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: '#000',
  },
  miniStripe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 1,
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackerColumn: {
    flex: 1.2,
  },
  boardColumn: {
    flex: 3,
    justifyContent: 'center',
  },
});
