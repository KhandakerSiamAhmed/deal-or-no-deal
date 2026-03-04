import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusPanelProps {
    phase: string;
    boxesToOpen: number;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ phase, boxesToOpen }) => {
    const getStatusText = () => {
        switch (phase) {
            case 'START':
            case 'PICK_OWN':
                return 'Select a briefcase to keep';
            case 'ELIMINATION':
                return `Open ${boxesToOpen} more briefcase${boxesToOpen > 1 ? 's' : ''}`;
            case 'OFFER':
                return 'The Banker is making an offer...';
            case 'FINAL_CHOICE':
                return 'Do you want to swap your briefcase?';
            case 'GAME_OVER':
                return 'Game Over';
            default:
                return '';
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#222',
        borderTopWidth: 1,
        borderTopColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
