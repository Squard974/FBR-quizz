import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Remplace par l'URL de ton backend

/**
 * Récupérer le token d'accès depuis AsyncStorage
 */
export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Aucun token trouvé.');
    }
    return token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token d\'accès :', error.message);
    throw error;
  }
};

/**
 * Récupérer les informations de l'utilisateur
 */
export const getUserInfo = async () => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur :', error.response?.data || error.message);
    throw error;
  }
};
