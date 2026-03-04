import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Box as BoxComponent } from './Box';
import { Box } from '../hooks/useGameLogic';

interface BoardProps {
    boxes: Box[];
    onBoxPress: (id: number) => void;
    playerBoxId: number | null;
    phase: string;
}

export const Board: React.FC<BoardProps> = ({ boxes, onBoxPress, playerBoxId, phase }) => {
    const disabled = phase !== 'PICK_OWN' && phase !== 'ELIMINATION' && phase !== 'FINAL_CHOICE';

    return (
        <View style={styles.boardContainer}>
            {boxes.map(box => (
                <BoxComponent
                    key={box.id}
                    id={box.id}
                    value={box.value}
                    isOpened={box.isOpened}
                    onPress={() => onBoxPress(box.id)}
                    disabled={disabled || (box.id === playerBoxId && phase !== 'FINAL_CHOICE')}
                    isSelected={box.id === playerBoxId}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    boardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
        width: '100%',
    }
});
