import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated } from 'react-native';

interface BoxProps {
    id: number;
    isOpened: boolean;
    value: number;
    onPress: () => void;
    disabled: boolean;
    isSelected?: boolean;
    boxSize?: number;
}

export const Box: React.FC<BoxProps> = ({ id, isOpened, value, onPress, disabled, isSelected, boxSize }) => {
    const formatValue = (val: number) => {
        if (val >= 1000000) return '$1M';
        if (val >= 1000) return '$' + (val / 1000) + 'k';
        if (val < 1) return '¢' + Math.round(val * 100);
        return '$' + val;
    };

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

    // Use pixel size from parent if available, otherwise fall back to a reasonable default
    const size = boxSize && boxSize > 0 ? boxSize : 80;
    const height = size * (62 / 80); // maintain aspect ratio

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            disabled={disabled || isOpened}
        >
            <Animated.View style={[styles.container, { width: size, height: height, margin: 4, transform: [{ scale }] }]}>
                {isOpened ? (
                    <ImageBackground
                        source={require('../assets/open_briefcase.png')}
                        style={styles.image}
                        resizeMode="contain"
                    >
                        <View style={styles.openedContent}>
                            <Text style={styles.valueText} adjustsFontSizeToFit numberOfLines={1}>
                                {formatValue(value)}
                            </Text>
                        </View>
                    </ImageBackground>
                ) : (
                    <ImageBackground
                        source={require('../assets/closed_briefcase.png')}
                        style={styles.image}
                        resizeMode="contain"
                    >
                        <View style={styles.closedContent}>
                            <Text style={styles.boxText} adjustsFontSizeToFit numberOfLines={1}>{id}</Text>
                        </View>
                    </ImageBackground>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closedContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '8%',
    },
    openedContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '25%',
        paddingHorizontal: '5%',
    },
    boxText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#000',
        textShadowColor: 'rgba(255,255,255,0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    valueText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1A472A',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
        textAlign: 'center',
    },
});
