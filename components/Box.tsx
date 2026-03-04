import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface BoxProps {
    id: number;
    isOpened: boolean;
    value: number;
    onPress: () => void;
    disabled: boolean;
    isSelected?: boolean;
}

export const Box: React.FC<BoxProps> = ({ id, isOpened, value, onPress, disabled, isSelected }) => {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isSelected && !isOpened) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
                    Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true })
                ])
            ).start();
        } else {
            scale.setValue(1);
        }
    }, [isSelected, isOpened]);

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            disabled={disabled || isOpened}
        >
            <Animated.View style={[
                styles.container,
                isOpened && styles.opened,
                isSelected && styles.selected,
                { transform: [{ scale }] }
            ]}>
                {!isOpened ? (
                    <Text style={styles.boxText}>{id}</Text>
                ) : (
                    <View style={styles.valueContainer}>
                        <Text style={styles.valueText}>
                            ${value >= 1000 ? (value / 1000) + 'k' : value}
                        </Text>
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 60,
        height: 45,
        backgroundColor: '#FFD700', // Gold color
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#B8860B',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    opened: {
        backgroundColor: '#2A2A2A',
        borderColor: '#444',
        shadowOpacity: 0,
        elevation: 0,
    },
    selected: {
        borderColor: '#00FF00',
        borderWidth: 3,
    },
    boxText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    valueContainer: {
        padding: 2,
    },
    valueText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    }
});
