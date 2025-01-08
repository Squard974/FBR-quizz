import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getToken } from '../services/authService'; // Pour récupérer le token JWT
import { logout } from '../services/authService'; // Le chemin relatif peut être ajusté selon la structure de ton projet

const HomeScreen = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const navigation = useNavigation();

  // Gestion du bouton physique "Retour"
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Quitter',
        'Êtes-vous sûr de vouloir quitter l’application ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Quitter', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: true }
      );
      return true; // Empêche l'action par défaut
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    // Nettoyage lors du démontage du composant
    return () => backHandler.remove();
  }, []);

  // Fonction pour se déconnecter
  const handleLogout = async () => {
    try {
      console.log('Tentative de déconnexion...');
      await logout(); // Appel de la fonction logout
      console.log('Déconnexion réussie');

      Alert.alert('Déconnexion réussie', 'Vous avez été déconnecté.');

      // Réinitialisation de la navigation
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
    }
  };

  // Fonction pour démarrer une partie
  const startGame = async () => {
    if (!selectedSport) {
      Alert.alert('Attention', 'Veuillez sélectionner un sport avant de lancer une partie.');
      return;
    }

    try {
      // Récupérer le token JWT
      const token = await getToken();

      // Faire la requête à l'API Django pour obtenir les athlètes du sport sélectionné
      const response = await axios.get(
        `http://127.0.0.1:8000/api/athletes/random/${selectedSport}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const athletes = response.data;

      // Si des athlètes ont été récupérés, naviguer vers la page des athlètes
      if (athletes.length > 0) {
        navigation.navigate('AthletesScreen', { athletes }); // Passer les athlètes récupérés à la vue suivante
      } else {
        Alert.alert('Aucun athlète', 'Aucun athlète disponible pour ce sport.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors du lancement de la partie.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.circleButton}>
          <Text style={styles.circleButtonText}>Déconnexion</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')} style={styles.circleButton}>
          <Text style={styles.circleButtonText}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Titre */}
      <Text style={styles.title}>Bienvenue sur FBR Quizz</Text>

      {/* Radio Buttons */}
      <View style={styles.radioContainer}>
        {['football', 'basketball', 'rugby'].map((sport) => (
          <TouchableOpacity
            key={sport}
            style={styles.radioButton}
            onPress={() => setSelectedSport(sport)}
          >
            <View style={[styles.radioCircle, selectedSport === sport && styles.radioSelected]} />
            <Text style={styles.radioText}>{sport}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bouton Lancer une partie */}
      <TouchableOpacity style={styles.startButton} onPress={startGame}>
        <Text style={styles.startButtonText}>Lancer une partie</Text>
      </TouchableOpacity>

      {/* Bouton Ladder */}
      <TouchableOpacity
        onPress={() => navigation.navigate('LadderScreen')}
        style={styles.ladderButton}
      >
        <Text style={styles.circleButtonText}>Ladder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EE6161',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  circleButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    width: 65,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  circleButtonText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    marginTop: 100,
  },
  radioContainer: {
    marginTop: 75,
    alignItems: 'center', // Aligné à gauche
    justifyContent: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'left',
    marginVertical: 10, // Espacement entre les boutons
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#FFD561',
  },
  radioText: {
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#FFD561',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 40,
    marginHorizontal: 40,
  },
  startButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ladderButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    borderRadius: 22,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
