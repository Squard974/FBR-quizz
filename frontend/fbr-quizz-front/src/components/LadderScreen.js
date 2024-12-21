import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import api from '../services/api';

const LadderScreen = () => {
    const [ladder, setLadder] = useState([]);

    useEffect(() => {
        api.get('/ladder/')
            .then((response) => setLadder(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <FlatList
            data={ladder}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View>
                    <Text>{item.username} - Elo: {item.elo}</Text>
                </View>
            )}
        />
    );
};

export default LadderScreen;
