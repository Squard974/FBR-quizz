import { getToken } from './authService';

export const fetchWithAuth = async (url: string, options: any = {}) => {
    try {
        const token = await getToken();

        if (!token) {
            throw new Error("Aucun token JWT trouvé. L'utilisateur doit se reconnecter.");
        }

        // Ajoute le token aux en-têtes
        const headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        // Fait la requête
        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            console.error(`Erreur API : ${response.status} ${response.statusText}`);
            throw new Error(`Erreur API : ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la requête protégée :', error);
        throw error;
    }
};
