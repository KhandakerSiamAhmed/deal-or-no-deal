import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import { useGameLogic, BOX_VALUES } from './hooks/useGameLogic';
import { Board } from './components/Board';
import { Tracker } from './components/Tracker';
import { StatusPanel } from './components/StatusPanel';
import { OfferModal } from './components/OfferModal';

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

  useEffect(() => {
    if (phase === 'GAME_OVER' && winnings !== null) {
      let message = `You won $${winnings.toLocaleString('en-US')}!`;
      if (offer !== null) {
        const playerBox = boxes.find(b => b.id === playerBoxId);
        if (playerBox) {
          message += `\n\nYour box contained $${playerBox.value.toLocaleString('en-US')}.`;
        }
      }

      Alert.alert(
        "Game Over",
        message,
        [
          { text: "Play Again", onPress: startGame }
        ]
      );
    }
  }, [phase, winnings, startGame, offer, boxes, playerBoxId]);

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
    paddingTop: 50, // Added padding for typical device notches running non-safe-area
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
    width: 30,
    height: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#00FF00',
  },
  playerBoxNumber: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackerColumn: {
    flex: 2,
  },
  boardColumn: {
    flex: 5,
    justifyContent: 'center',
  },
});
