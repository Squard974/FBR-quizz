import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const EndGameScreen = ({ route, navigation }) => {
  const { athletes, foundAthletes } = route.params;

  if (!athletes || !foundAthletes) {
    return (
      <View style={styles.container}>
        <Text>Il semble y avoir un problème avec les données.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Titre en haut */}
      <Text style={styles.title}>Partie terminée</Text>

      {/* Liste des résultats */}
      <FlatList
        data={athletes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.resultText,
                foundAthletes[index] ? styles.found : styles.notFound,
              ]}
            >
              {item.name}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.flatListContent} // Assure l'alignement des items
      />

      {/* Bouton retour à l'accueil */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Text style={styles.homeButtonText}>Revenir à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EE6161', // Couleur de fond de l'écran
    padding: 20,
    justifyContent: 'space-between', // Pour espacer le contenu du haut et du bas
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20, // Espacement au dessus et en dessous
    marginBottom: 50,
    marginTop: 50,
    color: '#333', // Couleur sombre
  },
  resultContainer: {
    marginBottom: 10,
    alignItems: 'center', // Centrer chaque élément individuellement
    width: '100%', // S'assurer que chaque élément prend toute la largeur
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Centrer le texte à l'intérieur de chaque élément
    padding: 10,
    borderWidth: 2,
    borderColor: '#fff', // Encadré blanc autour du texte
    borderRadius: 8,
    backgroundColor: '#fff', // Fond blanc autour du texte
    width: '80%', // Largeur réduite pour un meilleur rendu
  },
  found: {
    color: 'green',
  },
  notFound: {
    color: 'red',
  },
  flatListContent: {
    alignItems: 'center', // Centrer l'ensemble du contenu dans le FlatList
  },
  homeButton: {
    backgroundColor: '#FFD561', // Couleur du bouton
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignSelf: 'center', // Centrer horizontalement
    marginBottom: 20, // Espacement en bas
  },
  homeButtonText: {
    color: 'black', // Texte noir
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EndGameScreen;
