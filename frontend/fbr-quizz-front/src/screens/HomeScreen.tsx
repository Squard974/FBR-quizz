import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const goToLadder = () => {
    navigation.navigate('LadderScreen'); // Nom de l'écran du ladder
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur FBR Quizz</Text>
      <Button title="Voir le Ladder" onPress={goToLadder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;
