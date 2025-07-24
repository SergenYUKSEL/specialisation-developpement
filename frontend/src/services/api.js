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
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Response from server
   * @param email
   * @param password
   */
  async login(email, password) {
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erreur de connexion'
        };
      }

      return {
        success: true,
        data: data,
        message: data.message
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
   * User registration
   * @param {Object} userData - User data for registration
   * @param {string} userData.email - User email
   * @param {string} userData.pseudo - User pseudo
   * @param {string} userData.password - User password
   * @returns {Promise<Object>} Response from server
   */
  async register(userData) {
    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userData.email,
          pseudo: userData.pseudo,
          password: userData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erreur lors de l\'inscription'
        };
      }

      return {
        success: true,
        data: data,
        message: data.message
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'inscription'
      };
    }
  },

  async logout() {
    try {
      const response = await fetch("http://localhost:3000/api/users/logout", {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erreur lors de la déconnexion'
        };
      }

      return {
        success: true,
        message: data.message
      };

    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de la déconnexion'
      };
    }
  },

  /**
   * Vérifier si l'utilisateur est connecté via /me
   * @returns {Promise<Object>} Current user data or error
   */
  async checkAuth() {
    try {
      const response = await fetch("http://localhost:3000/api/users/me", {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Non authentifié'
        };
      }

      return {
        success: true,
        data: data,
        message: data.message
      };

    } catch (error) {
      console.error('Check auth error:', error);
      return {
        success: false,
        message: error.message || 'Erreur de vérification'
      };
    }
  },

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