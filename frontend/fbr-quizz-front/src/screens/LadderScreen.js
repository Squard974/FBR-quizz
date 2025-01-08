// src/screens/LadderScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const LadderScreen = () => {
    const [ladder, setLadder] = useState([]);

    useEffect(() => {
        // Appelle l'API pour récupérer le ladder
        const fetchLadder = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/ladder/');
                const data = await response.json();
                setLadder(data);
            } catch (error) {
                console.error('Erreur lors de la récupération du ladder :', error);
            }
        };

        fetchLadder();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Classement des joueurs</Text>
            <FlatList
                data={ladder}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.name}>{item.username}</Text>
                        <Text style={styles.elo}>Elo : {item.elo}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#EE6161',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    item: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    elo: {
        fontSize: 16,
        color: '#666',
    },
});

export default LadderScreen;
