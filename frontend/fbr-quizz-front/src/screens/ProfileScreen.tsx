import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { getToken } from '../services/authService'; // Remplacez par votre méthode d'obtention du token
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  // Fonction pour récupérer le profil de l'utilisateur
  const fetchUserProfile = async () => {
    try {
      const token = await getToken(); // Récupère le token JWT
      const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data); // Mettre à jour l'état avec les données du profil
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer le profil');
    }
  };

  useEffect(() => {
    fetchUserProfile(); // Appeler la fonction lors du premier rendu
  }, []);

  // Gérer le cas où l'utilisateur n'est pas encore chargé
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Photo de Profil */}
      <View style={styles.avatarContainer}>
        <Image
          source={user.avatar ? { uri: user.avatar } : require('../assets/default-avatar.png')}
          style={styles.avatar}
        />
      </View>

      {/* Informations de l'utilisateur */}
      <Text style={styles.title}>{user.username}</Text>
      <Text style={styles.text}>{user.email}</Text>
      {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
      <Text style={styles.text}>Elo : {user.elo}</Text>

      {/* Bouton de modification du profil (optionnel) */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfileScreen')}
      >
        <Text style={styles.editButtonText}>Modifier le Profil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EE6161',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#FFD561',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  editButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#999',
  },
});

export default ProfileScreen;
