/**
 * Authentication utilities for user management
 * Handles user state, validation, and session management
 */
import {authAPI} from "../services/api.js";

// User state management
let currentUser = null;
let authListeners = [];

/**
 * Validation utilities
 */
export const validation = {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email format
   */
  isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} Validation result with isValid and errors
   */
  validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Sanitize user input to prevent XSS
   * @param {string} input - Raw user input
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 255); // Limit length
  }
};

/**
 * Authentication state management
 */
export const auth = {
  /**
   * Get current authenticated user
   * @returns {object|null} Current user or null
   */
  getCurrentUser() {
    return currentUser;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is logged in
   */
  isAuthenticated() {
    return currentUser !== null;
  },

  /**
   * Set current user and notify listeners
   * @param {object} user - User object
   */
  setUser(user) {
    currentUser = user;
    this.saveToStorage(user);
    this.notifyListeners();
  },

  /**
   * Vérifier si l'utilisateur est connecté via le backend
   * @returns {Promise<boolean>} True if user is authenticated
   */
  async checkAuthStatus() {
    try {
      const response = await authAPI.checkAuth();

      if (response.success) {
        this.setUser(response.data.user);
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.logout();
      return false;
    }
  },

  /**
   * Logout current user
   */
  logout() {
    currentUser = null;
    this.clearStorage();
    this.notifyListeners();
  },

  /**
   * Add authentication state listener
   * @param {Function} callback - Function to call on auth state change
   */
  addListener(callback) {
    authListeners.push(callback);
  },

  /**
   * Remove authentication state listener
   * @param {Function} callback - Function to remove
   */
  removeListener(callback) {
    authListeners = authListeners.filter(listener => listener !== callback);
  },

  /**
   * Notify all listeners of auth state change
   */
  notifyListeners() {
    authListeners.forEach(callback => callback(currentUser));
  },

  /**
   * Save user to localStorage
   * @param {object} user - User object to save
   */
  saveToStorage(user) {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.warn('Could not save user to localStorage:', error);
    }
  },

  /**
   * Load user from localStorage
   * @returns {object|null} Saved user or null
   */
  loadFromStorage() {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        currentUser = JSON.parse(savedUser);
        return currentUser;
      }
    } catch (error) {
      console.warn('Could not load user from localStorage:', error);
    }
    return null;
  },

  /**
   * Clear user from localStorage
   */
  clearStorage() {
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.warn('Could not clear user from localStorage:', error);
    }
  },

  /**
   * Initialize auth system
   */ async init() {
    this.loadFromStorage();
    await this.checkAuthStatus();
  }
}; 