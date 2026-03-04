import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface GameOverScreenProps {
    winnings: number;
    playerBoxValue: number | null;
    tookDeal: boolean;
    onPlayAgain: () => void;
}

// ── Confetti Piece ──
const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF69B4', '#FFA07A', '#87CEEB', '#DDA0DD', '#98D8C8'];

const ConfettiPiece: React.FC<{ delay: number; index: number }> = ({ delay, index }) => {
    const translateY = useRef(new Animated.Value(-50)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const rotate = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const startX = useMemo(() => Math.random() * SCREEN_W, []);
    const color = useMemo(() => CONFETTI_COLORS[index % CONFETTI_COLORS.length], [index]);
    const size = useMemo(() => 6 + Math.random() * 8, []);
    const isRect = useMemo(() => Math.random() > 0.5, []);

    useEffect(() => {
        const drift = (Math.random() - 0.5) * 120;
        const duration = 2500 + Math.random() * 2000;

        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(translateY, {
                    toValue: SCREEN_H + 50,
                    duration,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: drift,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(rotate, {
                    toValue: 5 + Math.random() * 10,
                    duration,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: startX,
                top: 0,
                width: isRect ? size : size * 0.6,
                height: isRect ? size * 0.5 : size,
                backgroundColor: color,
                borderRadius: isRect ? 1 : size / 2,
                transform: [{ translateY }, { translateX }, { rotate: spin }],
                opacity,
                zIndex: 100,
            }}
        />
    );
};

// ── Animated Star ──
const StarParticle: React.FC<{ delay: number; index: number }> = ({ delay, index }) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const rotate = useRef(new Animated.Value(0)).current;

    const x = useMemo(() => 20 + Math.random() * (SCREEN_W - 40), []);
    const y = useMemo(() => 40 + Math.random() * (SCREEN_H - 80), []);
    const starSize = useMemo(() => 10 + Math.random() * 16, []);

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(scale, { toValue: 1.2, duration: 400, easing: Easing.out(Easing.back(3)), useNativeDriver: true }),
                    Animated.timing(scale, { toValue: 0.8, duration: 300, useNativeDriver: true }),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(scale, { toValue: 1.1, duration: 600, useNativeDriver: true }),
                            Animated.timing(scale, { toValue: 0.8, duration: 600, useNativeDriver: true }),
                        ])
                    ),
                ]),
                Animated.timing(opacity, { toValue: 0.9, duration: 300, useNativeDriver: true }),
                Animated.loop(
                    Animated.timing(rotate, { toValue: 1, duration: 3000 + Math.random() * 2000, useNativeDriver: true })
                ),
            ]),
        ]).start();
    }, []);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: [{ scale }, { rotate: spin }],
                opacity,
                zIndex: 50,
            }}
        >
            <Text style={{ fontSize: starSize, color: '#FFD700', textShadowColor: '#FFA500', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 }}>★</Text>
        </Animated.View>
    );
};

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ winnings, playerBoxValue, tookDeal, onPlayAgain }) => {
    // ── Background glow animation ──
    const glowOpacity = useRef(new Animated.Value(0)).current;
    const glowPulse = useRef(new Animated.Value(0)).current;

    // ── Title animation ──
    const titleScale = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;

    // ── Cheque reveal ──
    const chequeTranslateY = useRef(new Animated.Value(60)).current;
    const chequeOpacity = useRef(new Animated.Value(0)).current;
    const chequeScale = useRef(new Animated.Value(0.7)).current;

    // ── Sub info ──
    const subInfoOpacity = useRef(new Animated.Value(0)).current;

    // ── Button ──
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(0.5)).current;

    const formatMoney = (val: number) => {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: val < 1 ? 2 : 0 });
    };

    useEffect(() => {
        // Step 1: Yellow glow floods in (0-500ms)
        Animated.parallel([
            Animated.timing(glowOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();

        // Glow pulse loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowPulse, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(glowPulse, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])
        ).start();

        // Step 2: Title stamps in (300-700ms)
        Animated.sequence([
            Animated.delay(300),
            Animated.parallel([
                Animated.spring(titleScale, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }),
                Animated.timing(titleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]),
        ]).start();

        // Step 3: Cheque slides up (800-1300ms)
        Animated.sequence([
            Animated.delay(800),
            Animated.parallel([
                Animated.spring(chequeTranslateY, { toValue: 0, friction: 5, tension: 80, useNativeDriver: true }),
                Animated.timing(chequeOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(chequeScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
            ]),
        ]).start();

        // Step 4: Sub info fades in (1500ms)
        Animated.sequence([
            Animated.delay(1500),
            Animated.timing(subInfoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();

        // Step 5: Play Again button bounces in (2000ms)
        Animated.sequence([
            Animated.delay(2000),
            Animated.parallel([
                Animated.timing(buttonOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.spring(buttonScale, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

    const glowBg = glowPulse.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255, 215, 0, 0.08)', 'rgba(255, 215, 0, 0.20)'],
    });

    // Generate confetti pieces
    const confettiPieces = useMemo(() =>
        Array.from({ length: 60 }).map((_, i) => (
            <ConfettiPiece key={`confetti-${i}`} delay={200 + Math.random() * 1500} index={i} />
        )), []
    );

    // Generate stars
    const stars = useMemo(() =>
        Array.from({ length: 15 }).map((_, i) => (
            <StarParticle key={`star-${i}`} delay={600 + i * 150} index={i} />
        )), []
    );

    return (
        <View style={styles.overlay}>
            {/* Yellow glow background */}
            <Animated.View style={[styles.glowBg, { opacity: glowOpacity }]}>
                <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: glowBg as any }]} />
            </Animated.View>

            {/* Confetti */}
            {confettiPieces}

            {/* Stars */}
            {stars}

            {/* Content */}
            <View style={styles.contentContainer}>
                {/* Title */}
                <Animated.View style={{ transform: [{ scale: titleScale }], opacity: titleOpacity }}>
                    <Text style={styles.gameOverTitle}>🎉 GAME OVER 🎉</Text>
                </Animated.View>

                {/* Big Cheque Card */}
                <Animated.View style={[
                    styles.bigCheque,
                    {
                        transform: [{ translateY: chequeTranslateY }, { scale: chequeScale }],
                        opacity: chequeOpacity,
                    }
                ]}>
                    {/* Cheque decorative top */}
                    <View style={styles.chequeTopBorder} />
                    <Text style={styles.chequeBankLabel}>SEALED FORTUNE BANK</Text>
                    <View style={styles.chequeAmountRow}>
                        <Text style={styles.chequePayLabel}>PAY TO THE ORDER OF</Text>
                        <Text style={styles.chequePayee}>★ WINNER ★</Text>
                    </View>
                    <View style={styles.chequeAmountBox}>
                        <Text style={styles.chequeAmount}>{formatMoney(winnings)}</Text>
                    </View>
                    <View style={styles.chequeBottomRow}>
                        <View style={styles.chequeSignatureLine} />
                        <Text style={styles.chequeSignatureLabel}>The Banker</Text>
                    </View>
                    {/* Cheque decorative bottom */}
                    <View style={styles.chequeBottomBorder} />
                </Animated.View>

                {/* Subinfo: your box contained... */}
                {tookDeal && playerBoxValue !== null && (
                    <Animated.View style={{ opacity: subInfoOpacity, marginTop: 16 }}>
                        <Text style={styles.subInfoText}>
                            Your briefcase contained{' '}
                            <Text style={styles.subInfoAmount}>{formatMoney(playerBoxValue)}</Text>
                        </Text>
                    </Animated.View>
                )}

                {/* Play Again Button */}
                <Animated.View style={{ transform: [{ scale: buttonScale }], opacity: buttonOpacity, marginTop: 30 }}>
                    <TouchableOpacity style={styles.playAgainButton} onPress={onPlayAgain} activeOpacity={0.8}>
                        <Text style={styles.playAgainText}>🎲 PLAY AGAIN</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        zIndex: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowBg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    contentContainer: {
        alignItems: 'center',
        zIndex: 60,
        paddingHorizontal: 20,
    },
    gameOverTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFD700',
        textShadowColor: 'rgba(255, 215, 0, 0.7)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        letterSpacing: 3,
        marginBottom: 30,
    },

    // ── Big Cheque ──
    bigCheque: {
        width: SCREEN_W * 0.85,
        backgroundColor: '#FFF8E7',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#C9A961',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
    },
    chequeTopBorder: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        height: 2,
        backgroundColor: '#DAA520',
        borderRadius: 1,
    },
    chequeBankLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#8B6914',
        letterSpacing: 3,
        marginTop: 8,
        marginBottom: 10,
    },
    chequeAmountRow: {
        alignItems: 'center',
        marginBottom: 8,
    },
    chequePayLabel: {
        fontSize: 10,
        color: '#999',
        letterSpacing: 1,
    },
    chequePayee: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 2,
        marginTop: 2,
    },
    chequeAmountBox: {
        backgroundColor: '#1A472A',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    chequeAmount: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#FFD700',
        textShadowColor: 'rgba(255, 215, 0, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        letterSpacing: 2,
    },
    chequeBottomRow: {
        alignItems: 'flex-end',
        alignSelf: 'stretch',
        marginTop: 10,
        paddingRight: 10,
    },
    chequeSignatureLine: {
        width: 120,
        height: 1,
        backgroundColor: '#999',
        marginBottom: 3,
    },
    chequeSignatureLabel: {
        fontSize: 10,
        color: '#888',
        fontStyle: 'italic',
    },
    chequeBottomBorder: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        height: 2,
        backgroundColor: '#DAA520',
        borderRadius: 1,
    },

    subInfoText: {
        fontSize: 16,
        color: '#CCC',
    },
    subInfoAmount: {
        color: '#FF6B6B',
        fontWeight: 'bold',
        fontSize: 18,
    },

    playAgainButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 30,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 10,
    },
    playAgainText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 2,
    },
});
