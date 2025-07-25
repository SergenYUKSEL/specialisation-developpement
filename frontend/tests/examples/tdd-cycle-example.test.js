/**
 * Exemple pratique du cycle TDD : RED-GREEN-REFACTOR
 * 
 * Fonctionnalité à implémenter : Validateur de numéro de téléphone français
 * 
 * Ce fichier démontre étape par étape comment suivre la méthodologie TDD
 */

// OBJECTIF: Créer un validateur de numéro de téléphone français
// Format accepté: 0X XX XX XX XX ou +33 X XX XX XX XX

// Fonctions minimales pour que tous les tests passent
function validateFrenchPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\.]/g, '');
  const mobileRegex = /^0[67]\d{8}$/;
  const internationalRegex = /^\+33[67]\d{8}$/;
  return mobileRegex.test(cleaned) || internationalRegex.test(cleaned);
}

function normalizeFrenchPhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[\s\-\.]/g, '');
}

class FrenchPhoneValidator {
  constructor() {
    this.patterns = {
      mobile: /^0[67]\d{8}$/,
      international: /^\+33[67]\d{8}$/,
      landline: /^0[1-5]\d{8}$/
    };
  }
  clean(phone) {
    if (!phone || typeof phone !== 'string') return '';
    return phone.replace(/[\s\-\.\(\)]/g, '');
  }
  validateMobile(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const cleaned = this.clean(phone);
    return this.patterns.mobile.test(cleaned) || this.patterns.international.test(cleaned);
  }
  normalize(phone, format = 'national') {
    const cleaned = this.clean(phone);
    if (!this.validateMobile(phone)) return '';
    if (format === 'international') {
      if (cleaned.startsWith('0')) return '+33' + cleaned.substring(1);
      return cleaned;
    }
    if (cleaned.startsWith('+33')) return '0' + cleaned.substring(3);
    return cleaned;
  }
  format(phone) {
    const normalized = this.normalize(phone, 'national');
    if (!normalized) return '';
    return normalized.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
}

describe('TDD Cycle Example - Phone Validator', () => {
  
  // ==========================================
  // ÉTAPE 1: RED - Écrire des tests qui échouent
  // ==========================================
  
  describe('🔴 PHASE RED - Tests qui échouent initialement', () => {
    
    // TEST 1: Validation d'un numéro français valide
    test('should validate French mobile number format', () => {
      // Arrange
      const validNumbers = [
        '06 12 34 56 78',
        '07 12 34 56 78',
        '0612345678',
        '+33 6 12 34 56 78',
        '+33612345678'
      ];

      // Act & Assert
      validNumbers.forEach(number => {
        expect(validateFrenchPhone(number)).toBe(true);
      });
    });

    // TEST 2: Rejet des numéros invalides
    test('should reject invalid phone numbers', () => {
      // Arrange
      const invalidNumbers = [
        '05 12 34 56 78', // Fixe (pas mobile)
        '1234567890',     // Pas assez de chiffres
        '+44 123456789',  // Indicatif UK
        'abc def gh ij',  // Lettres
        '',               // Vide
        null,             // Null
        undefined         // Undefined
      ];

      // Act & Assert
      invalidNumbers.forEach(number => {
        expect(validateFrenchPhone(number)).toBe(false);
      });
    });

    // TEST 3: Normalisation des numéros
    test('should normalize phone numbers to standard format', () => {
      // Arrange
      const inputs = [
        { input: '06 12 34 56 78', expected: '0612345678' },
        { input: '+33 6 12 34 56 78', expected: '+33612345678' },
        { input: '06.12.34.56.78', expected: '0612345678' },
        { input: '06-12-34-56-78', expected: '0612345678' }
      ];

      // Act & Assert
      inputs.forEach(({ input, expected }) => {
        expect(normalizeFrenchPhone(input)).toBe(expected);
      });
    });
  });

  // ==========================================
  // ÉTAPE 2: GREEN - Implémentation minimale
  // ==========================================
  
  describe('🟢 PHASE GREEN - Implémentation qui fait passer les tests', () => {
    
    // IMPLÉMENTATION MINIMALE (sera dans un fichier séparé en réalité)
    // Les tests passent maintenant avec cette implémentation basique
    test('GREEN: Basic implementation should pass validation tests', () => {
      expect(validateFrenchPhone('06 12 34 56 78')).toBe(true);
      expect(validateFrenchPhone('05 12 34 56 78')).toBe(false);
      expect(normalizeFrenchPhone('06 12 34 56 78')).toBe('0612345678');
    });
  });

  // ==========================================
  // ÉTAPE 3: REFACTOR - Améliorer le code
  // ==========================================
  
  describe('🔄 PHASE REFACTOR - Code amélioré et optimisé', () => {
    
    // REFACTORING: Code plus robuste, lisible et maintenable
    // TESTS REFACTORISÉS avec la nouvelle classe
    let validator;

    beforeEach(() => {
      validator = new FrenchPhoneValidator();
    });

    test('REFACTOR: Enhanced validator should handle edge cases', () => {
      // Tests plus robustes
      expect(validator.validateMobile('06 12 34 56 78')).toBe(true);
      expect(validator.validateMobile('06.12.34.56.78')).toBe(true);
      expect(validator.validateMobile('06-12-34-56-78')).toBe(true);
      expect(validator.validateMobile('(06) 12 34 56 78')).toBe(true);
    });

    test('REFACTOR: Should normalize to different formats', () => {
      const phone = '06 12 34 56 78';
      
      expect(validator.normalize(phone, 'national')).toBe('0612345678');
      expect(validator.normalize(phone, 'international')).toBe('+33612345678');
    });

    test('REFACTOR: Should format for display', () => {
      expect(validator.format('0612345678')).toBe('06 12 34 56 78');
      expect(validator.format('+33612345678')).toBe('06 12 34 56 78');
    });

    test('REFACTOR: Should handle invalid inputs gracefully', () => {
      const invalidInputs = [null, undefined, '', '123', 'invalid'];
      
      invalidInputs.forEach(input => {
        expect(validator.validateMobile(input)).toBe(false);
        expect(validator.normalize(input)).toBe('');
        expect(validator.format(input)).toBe('');
      });
    });
  });

  // ==========================================
  // TESTS SUPPLÉMENTAIRES APRÈS REFACTOR
  // ==========================================
  
  describe('📋 Additional Tests - Coverage Complete', () => {
    let validator;

    beforeEach(() => {
      validator = new FrenchPhoneValidator();
    });

    test('should handle international to national conversion', () => {
      const internationalNumbers = [
        { input: '+33612345678', expected: '0612345678' },
        { input: '+33 7 12 34 56 78', expected: '0712345678' }
      ];

      internationalNumbers.forEach(({ input, expected }) => {
        expect(validator.normalize(input, 'national')).toBe(expected);
      });
    });

    test('should handle national to international conversion', () => {
      const nationalNumbers = [
        { input: '0612345678', expected: '+33612345678' },
        { input: '07 12 34 56 78', expected: '+33712345678' }
      ];

      nationalNumbers.forEach(({ input, expected }) => {
        expect(validator.normalize(input, 'international')).toBe(expected);
      });
    });

    test('should clean various separator formats', () => {
      const dirtyNumbers = [
        '06 12 34 56 78',
        '06.12.34.56.78',
        '06-12-34-56-78',
        '(06) 12 34 56 78',
        '06  12  34  56  78'
      ];

      dirtyNumbers.forEach(number => {
        expect(validator.clean(number)).toBe('0612345678');
      });
    });
  });
});

// ==========================================
// RÉSUMÉ DU CYCLE TDD
// ==========================================

/*
🔴 RED Phase:
- Écriture des tests AVANT le code
- Tests échouent car fonctionnalité n'existe pas
- Définit le comportement attendu

🟢 GREEN Phase:
- Implémentation minimale pour faire passer les tests
- Code pas forcément élégant, juste fonctionnel
- Tous les tests passent

🔄 REFACTOR Phase:
- Amélioration du code sans casser les tests
- Meilleure architecture, lisibilité, performance
- Ajout de nouveaux tests pour couvrir plus de cas

Avantages démontrés:
✅ Code testé à 100%
✅ Spécifications claires dès le départ
✅ Refactoring sécurisé
✅ Documentation vivante via les tests
✅ Détection immédiate des régressions
*/ 