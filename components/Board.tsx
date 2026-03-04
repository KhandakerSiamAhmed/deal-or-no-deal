import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, LayoutChangeEvent } from 'react-native';
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
    const [boardWidth, setBoardWidth] = useState(0);

    const handleLayout = (event: LayoutChangeEvent) => {
        setBoardWidth(event.nativeEvent.layout.width);
    };

    // 3 boxes per row: each box gets ~30% of board width, with ~3% margin on each side
    const COLS = 3;
    const MARGIN = 4;
    const boxSize = boardWidth > 0 ? (boardWidth - MARGIN * (COLS * 2 + 2)) / COLS : 0;

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.boardContainer} onLayout={handleLayout}>
            {boxes.map(box => (
                <BoxComponent
                    key={box.id}
                    id={box.id}
                    value={box.value}
                    isOpened={box.isOpened}
                    onPress={() => onBoxPress(box.id)}
                    disabled={disabled || (box.id === playerBoxId && phase !== 'FINAL_CHOICE')}
                    isSelected={box.id === playerBoxId}
                    boxSize={boxSize}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        width: '100%',
    },
    boardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4,
    }
});
