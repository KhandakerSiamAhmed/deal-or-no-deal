import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface OfferModalProps {
    visible: boolean;
    offer: number | null;
    onDeal: () => void;
    onNoDeal: () => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({ visible, offer, onDeal, onNoDeal }) => {
    const formatOffer = (val: number | null) => {
        if (!val) return '$0';
        return '$' + val.toLocaleString('en-US');
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.bankerText}>THE BANKER OFFERS:</Text>
                    <Text style={styles.offerText}>{formatOffer(offer)}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.dealButton]} onPress={onDeal}>
                            <Text style={styles.buttonText}>DEAL</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.noDealButton]} onPress={onNoDeal}>
                            <Text style={styles.buttonText}>NO DEAL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#111',
        borderRadius: 8,
        padding: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#333',
    },
    bankerText: {
        color: '#CCC',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 10,
    },
    offerText: {
        color: '#FFD700', // Gold
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 30,
        textShadowColor: 'rgba(255, 215, 0, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    dealButton: {
        backgroundColor: '#00C853', // Bright Green
    },
    noDealButton: {
        backgroundColor: '#D50000', // Bright Red
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
