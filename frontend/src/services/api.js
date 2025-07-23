/**
 * API service for authentication
 * Handles communication with the backend authentication endpoints
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * User login (simulé car le backend n'a pas d'authentification)
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email  
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Response from server
   */
  async login(credentials) {
    try {
      // Simulation d'authentification car le backend n'a pas ces endpoints
      // En attendant l'implémentation backend
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      // Mock validation - dans un vrai système, ceci serait géré par le backend
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          message: 'Email et mot de passe requis'
        };
      }

      if (credentials.password.length < 6) {
        return {
          success: false,
          message: 'Mot de passe trop court'
        };
      }

      // Mock successful login
      const mockUser = {
        id: 1,
        email: credentials.email,
        firstName: credentials.email.split('@')[0],
        pseudo: credentials.email.split('@')[0]
      };

      return {
        success: true,
        data: mockUser,
        message: 'Connexion réussie'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Erreur de connexion au serveur'
      };
    }
  },

  /**
   * User registration (simulé car le backend n'a pas d'authentification)
   * @param {Object} userData - User data for registration
   * @param {string} userData.email - User email
   * @param {string} userData.pseudo - User pseudo
   * @param {string} userData.password - User password
   * @returns {Promise<Object>} Response from server
   */
  async register(userData) {
    try {
      // Simulation d'inscription car le backend n'a pas ces endpoints
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      // Mock validation
      if (!userData.email || !userData.pseudo || !userData.password) {
        return {
          success: false,
          message: 'Tous les champs sont requis'
        };
      }

      if (userData.password.length < 6) {
        return {
          success: false,
          message: 'Le mot de passe doit contenir au moins 6 caractères'
        };
      }

      if (!userData.email.includes('@')) {
        return {
          success: false,
          message: 'Format d\'email invalide'
        };
      }

      // Mock successful registration
      const mockUser = {
        id: Date.now(),
        email: userData.email,
        pseudo: userData.pseudo,
        firstName: userData.pseudo
      };

      return {
        success: true,
        data: mockUser,
        message: 'Inscription réussie'
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'inscription'
      };
    }
  },

  /**
   * Get current user profile (simulé)
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} User profile data
   */
  async getProfile(token) {
    try {
      // Simulation car le backend n'a pas ces endpoints
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock profile data
      const mockProfile = {
        id: 1,
        email: 'user@example.com',
        pseudo: 'user',
        firstName: 'User'
      };

      return {
        success: true,
        data: mockProfile
      };

    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.message || 'Erreur de connexion au serveur'
      };
    }
  }
};

/**
 * Handle API errors consistently
 * @param {Error} error - The error to handle
 * @param {string} defaultMessage - Default error message
 * @returns {string} User-friendly error message
 */
export function handleApiError(error, defaultMessage = 'Une erreur est survenue') {
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
}

/**
 * Check if response indicates authentication error
 * @param {Response} response - Fetch response
 * @returns {boolean} True if auth error
 */
export function isAuthError(response) {
  return response.status === 401 || response.status === 403;
}

/**
 * Generic API request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Erreur HTTP ${response.status}`);
    }

    return {
      success: true,
      data: data,
      status: response.status
    };

  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    return {
      success: false,
      message: error.message || 'Erreur de connexion au serveur',
      status: error.status || 500
    };
  }
} 