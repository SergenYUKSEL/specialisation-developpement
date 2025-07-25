/**
 * Tests TDD pour les utilitaires d'authentification
 * Suit les principes FIRST (Fast, Independent, Repeatable, Self-validating, Timely)
 * Méthodologie: RED -> GREEN -> REFACTOR
 */

import { validation, auth } from '../../src/utils/auth.js';

// Mock des dépendances
jest.mock('../../src/services/api.js', () => ({
  authAPI: {
    checkAuth: jest.fn(),
    logout: jest.fn()
  }
}));

describe('Validation utilities - TDD', () => {
  describe('Email validation', () => {
    // TEST 1: RED - Test pour valider un email valide
    test('should validate correct email format', () => {
      // Arrange
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];

      // Act & Assert
      validEmails.forEach(email => {
        expect(validation.isValidEmail(email)).toBe(true);
      });
    });

    // TEST 2: RED - Test pour rejeter un email invalide
    test('should reject invalid email format', () => {
      // Arrange
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        ''
      ];

      // Act & Assert
      invalidEmails.forEach(email => {
        expect(validation.isValidEmail(email)).toBe(false);
      });
    });

    // TEST 3: RED - Test pour gérer les espaces
    test('should handle emails with spaces correctly', () => {
      // Arrange
      const emailWithSpaces = '  test@example.com  ';
      const invalidWithSpaces = '  invalid email  ';

      // Act & Assert
      expect(validation.isValidEmail(emailWithSpaces)).toBe(true);
      expect(validation.isValidEmail(invalidWithSpaces)).toBe(false);
    });
  });

  describe('Password validation', () => {
    // TEST 4: RED - Test pour un mot de passe valide
    test('should validate strong password', () => {
      // Arrange
      const strongPassword = 'StrongPass123!';

      // Act
      const result = validation.validatePassword(strongPassword);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    // TEST 5: RED - Test pour un mot de passe trop court
    test('should reject password that is too short', () => {
      // Arrange
      const shortPassword = 'Short1!';

      // Act
      const result = validation.validatePassword(shortPassword);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins 8 caractères');
    });

    // TEST 6: RED - Test pour un mot de passe sans majuscule
    test('should reject password without uppercase letter', () => {
      // Arrange
      const passwordNoUpper = 'password123!';

      // Act
      const result = validation.validatePassword(passwordNoUpper);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins une majuscule');
    });

    // TEST 7: RED - Test pour un mot de passe sans minuscule
    test('should reject password without lowercase letter', () => {
      // Arrange
      const passwordNoLower = 'PASSWORD123!';

      // Act
      const result = validation.validatePassword(passwordNoLower);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins une minuscule');
    });

    // TEST 8: RED - Test pour un mot de passe sans chiffre
    test('should reject password without digit', () => {
      // Arrange
      const passwordNoDigit = 'Password!';

      // Act
      const result = validation.validatePassword(passwordNoDigit);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins un chiffre');
    });

    // TEST 9: RED - Test pour un mot de passe sans caractère spécial
    test('should reject password without special character', () => {
      // Arrange
      const passwordNoSpecial = 'Password123';

      // Act
      const result = validation.validatePassword(passwordNoSpecial);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins un caractère spécial');
    });

    // TEST 10: RED - Test pour plusieurs erreurs simultanées
    test('should return multiple errors for weak password', () => {
      // Arrange
      const weakPassword = 'weak';

      // Act
      const result = validation.validatePassword(weakPassword);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins 8 caractères');
      expect(result.errors).toContain('Le mot de passe doit contenir au moins une majuscule');
    });
  });

  describe('Input sanitization', () => {
    // TEST 11: RED - Test pour sanitiser les entrées utilisateur
    test('should sanitize user input', () => {
      // Arrange
      const maliciousInput = '  <script>alert("xss")</script>  ';
      const normalInput = '  Normal input  ';

      // Act
      const sanitizedMalicious = validation.sanitizeInput(maliciousInput);
      const sanitizedNormal = validation.sanitizeInput(normalInput);

      // Assert
      expect(sanitizedMalicious).not.toContain('<');
      expect(sanitizedMalicious).not.toContain('>');
      expect(sanitizedNormal).toBe('Normal input');
    });

    // TEST 12: RED - Test pour gérer les entrées non-string
    test('should handle non-string input', () => {
      // Arrange
      const inputs = [null, undefined, 123, {}, []];

      // Act & Assert
      inputs.forEach(input => {
        expect(validation.sanitizeInput(input)).toBe('');
      });
    });

    // TEST 13: RED - Test pour limiter la longueur
    test('should limit input length', () => {
      // Arrange
      const longInput = 'a'.repeat(300);

      // Act
      const result = validation.sanitizeInput(longInput);

      // Assert
      expect(result.length).toBeLessThanOrEqual(255);
    });
  });
});

describe('Auth service - TDD', () => {
  beforeEach(() => {
    // Reset auth state before each test
    auth.logout();
    localStorage.clear();
  });

  describe('User authentication state', () => {
    // TEST 14: RED - Test pour vérifier l'état initial
    test('should initialize with no user', () => {
      // Act & Assert
      expect(auth.getCurrentUser()).toBeNull();
      expect(auth.isAuthenticated()).toBe(false);
    });

    // TEST 15: RED - Test pour définir un utilisateur
    test('should set and get current user', () => {
      // Arrange
      const testUser = {
        id: 1,
        pseudo: 'testuser',
        email: 'test@example.com'
      };

      // Act
      auth.setUser(testUser);

      // Assert
      expect(auth.getCurrentUser()).toEqual(testUser);
      expect(auth.isAuthenticated()).toBe(true);
    });

    // TEST 16: RED - Test pour sauvegarder dans localStorage
    test('should save user to localStorage', () => {
      // Arrange
      const testUser = {
        id: 1,
        pseudo: 'testuser',
        email: 'test@example.com'
      };

      // Act
      auth.setUser(testUser);

      // Assert
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(testUser)
      );
    });

    // TEST 17: RED - Test pour charger depuis localStorage
    test('should load user from localStorage', () => {
      // Arrange
      const testUser = {
        id: 1,
        pseudo: 'testuser',
        email: 'test@example.com'
      };
      localStorage.getItem.mockReturnValue(JSON.stringify(testUser));

      // Act
      const result = auth.loadFromStorage();

      // Assert
      expect(result).toEqual(testUser);
      expect(auth.getCurrentUser()).toEqual(testUser);
    });

    // TEST 18: RED - Test pour gérer localStorage corrompu
    test('should handle corrupted localStorage data', () => {
      // Arrange
      localStorage.getItem.mockReturnValue('invalid json');

      // Act
      const result = auth.loadFromStorage();

      // Assert
      expect(result).toBeNull();
      expect(auth.getCurrentUser()).toBeNull();
    });
  });

  describe('Authentication listeners', () => {
    // TEST 19: RED - Test pour ajouter des listeners
    test('should add and call authentication listeners', () => {
      // Arrange
      const mockListener = jest.fn();
      const testUser = { id: 1, pseudo: 'test' };

      // Act
      auth.addListener(mockListener);
      auth.setUser(testUser);

      // Assert
      expect(mockListener).toHaveBeenCalledWith(testUser);
    });

    // TEST 20: RED - Test pour supprimer des listeners
    test('should remove authentication listeners', () => {
      // Arrange
      const mockListener = jest.fn();
      const testUser = { id: 1, pseudo: 'test' };

      // Act
      auth.addListener(mockListener);
      auth.removeListener(mockListener);
      auth.setUser(testUser);

      // Assert
      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe('Logout functionality', () => {
    // TEST 21: RED - Test pour déconnexion
    test('should clear user on logout', async () => {
      // Arrange
      const testUser = { id: 1, pseudo: 'test' };
      auth.setUser(testUser);

      // Act
      await auth.logout();

      // Assert
      expect(auth.getCurrentUser()).toBeNull();
      expect(auth.isAuthenticated()).toBe(false);
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });

    // TEST 22: RED - Test pour notifier les listeners lors de la déconnexion
    test('should notify listeners on logout', async () => {
      // Arrange
      const mockListener = jest.fn();
      const testUser = { id: 1, pseudo: 'test' };
      auth.setUser(testUser);
      auth.addListener(mockListener);

      // Act
      await auth.logout();

      // Assert
      expect(mockListener).toHaveBeenCalledWith(null);
    });
  });
}); 