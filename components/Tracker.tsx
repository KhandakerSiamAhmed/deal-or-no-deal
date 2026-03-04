import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TrackerProps {
    values: number[];
    openedValues: number[];
    colorTheme: 'blue' | 'red';
}

export const Tracker: React.FC<TrackerProps> = ({ values, openedValues, colorTheme }) => {
    const formatMoney = (val: number) => {
        if (val < 1) return `$${val.toFixed(2)}`;
        return '$' + val.toLocaleString('en-US');
    };

    const getBackgroundColor = (val: number) => {
        if (colorTheme === 'red') {
            return '#FF4500'; // Right side (high values)
        }
        return '#1E90FF'; // Left side (low values)
    };

    return (
        <View style={styles.container}>
            {values.map((val, index) => {
                const isOpened = openedValues.includes(val);
                return (
                    <View
                        key={index}
                        style={[
                            styles.amountBox,
                            { backgroundColor: isOpened ? '#222' : getBackgroundColor(val) }
                        ]}
                    >
                        <Text style={[
                            styles.amountText,
                            isOpened && styles.amountTextOpened,
                            { color: isOpened ? '#555' : '#FFF' }
                        ]}>
                            {formatMoney(val)}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 4,
        marginVertical: 10,
    },
    amountBox: {
        paddingVertical: 6,
        paddingHorizontal: 2,
        marginBottom: 2,
        borderRadius: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    amountText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    amountTextOpened: {
        textDecorationLine: 'line-through'
    }
});
