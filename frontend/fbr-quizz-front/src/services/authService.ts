import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // Remplace par ton IP locale

// Fonction pour gérer la connexion
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { email, password });
    console.log("Réponse de l'API :", response.data);

    // Vérifie que le token existe sous le bon nom (ici 'access' au lieu de 'accessToken')
    if (response.data && response.data.access) {
      await AsyncStorage.setItem('accessToken', response.data.access); // Utilise 'access' ici
      await AsyncStorage.setItem('refreshToken', response.data.refresh);
      console.log("Token stocké avec succès");
      return response.data; // Retourne les données, y compris le token
    } else {
      console.error("Token manquant dans la réponse");
      throw new Error("Token manquant");
    }
  } catch (error) {
    console.error('Erreur lors de la tentative de connexion :', error);
    throw error;
  }
};


// Fonction pour gérer l'enregistrement de l'utilisateur
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, { username, email, password });
    console.log("Réponse de l'API : ", response.data);
    return response.data; // Retourne les données de l'utilisateur ou un message de succès
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement :', error);
    throw error; // Lancer l'erreur pour pouvoir la gérer ailleurs
  }
};


// Fonction pour récupérer le token depuis AsyncStorage
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      return token;
    } else {
      console.warn('Aucun token trouvé');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du token', error);
    return null;
  }
};

// Fonction pour se déconnecter
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    console.log('Utilisateur déconnecté');
  } catch (error) {
    console.error('Erreur lors de la déconnexion', error);
  }
};
