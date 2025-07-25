/**
 * Tests TDD pour le service de panier
 * Suit les principes FIRST (Fast, Independent, Repeatable, Self-validating, Timely)
 * Méthodologie: RED -> GREEN -> REFACTOR
 */

import { cartService, cartOperations } from '../../src/services/cart.js';

describe('CartService - TDD', () => {
  // Produit de test réutilisable
  const testProduct = {
    id: 1,
    libelle: 'Produit Test',
    prix: 19.99,
    images: ['/test-image.jpg'],
    categorie: 'Test',
    stock: 50
  };

  beforeEach(() => {
    // Reset cart state before each test
    cartService.clear();
    localStorage.clear();
  });

  describe('Initialization', () => {
    // TEST 1: RED - Test d'initialisation du service
    test('should initialize with empty cart', () => {
      // Act
      cartService.init();

      // Assert
      expect(cartService.getItems()).toHaveLength(0);
      expect(cartService.getSummary().isEmpty).toBe(true);
    });

    // TEST 2: RED - Test de chargement depuis localStorage
    test('should load cart from localStorage on init', () => {
      // Arrange
      const savedCart = [{ ...testProduct, quantity: 2 }];
      localStorage.setItem('shopping_cart', JSON.stringify(savedCart));

      // Act
      cartService.init();

      // Assert
      expect(cartService.getItems()).toHaveLength(1);
      expect(cartService.getItemQuantity(testProduct.id)).toBe(2);
    });

    // TEST 3: RED - Test de migration des anciennes données
    test('should migrate old cart structure on init', () => {
      // Arrange
      const oldCartItem = {
        id: 1,
        libelle: 'Test',
        prix: 10,
        image: '/old-image.jpg', // Ancienne structure
        quantity: 1
      };
      localStorage.setItem('shopping_cart', JSON.stringify([oldCartItem]));

      // Act
      cartService.init();

      // Assert
      const items = cartService.getItems();
      expect(items[0].images).toEqual(['/old-image.jpg']);
      expect(items[0].stock).toBe(50);
    });
  });

  describe('Adding items', () => {
    // TEST 4: RED - Test d'ajout d'un produit
    test('should add new product to cart', () => {
      // Act
      const result = cartService.addItem(testProduct, 1);

      // Assert
      expect(result).toBe(true);
      expect(cartService.getItems()).toHaveLength(1);
      expect(cartService.getItemQuantity(testProduct.id)).toBe(1);
    });

    // TEST 5: RED - Test d'ajout de quantité à un produit existant
    test('should increase quantity for existing product', () => {
      // Arrange
      cartService.addItem(testProduct, 1);

      // Act
      const result = cartService.addItem(testProduct, 2);

      // Assert
      expect(result).toBe(true);
      expect(cartService.getItems()).toHaveLength(1);
      expect(cartService.getItemQuantity(testProduct.id)).toBe(3);
    });

    // TEST 6: RED - Test d'ajout avec quantité par défaut
    test('should add product with default quantity of 1', () => {
      // Act
      cartService.addItem(testProduct);

      // Assert
      expect(cartService.getItemQuantity(testProduct.id)).toBe(1);
    });

    // TEST 7: RED - Test de sauvegarde automatique
    test('should save to localStorage when adding item', () => {
      // Act
      cartService.addItem(testProduct, 1);

      // Assert
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'shopping_cart',
        expect.stringContaining(testProduct.libelle)
      );
    });
  });

  describe('Removing items', () => {
    beforeEach(() => {
      // Setup: Add test product to cart
      cartService.addItem(testProduct, 2);
    });

    // TEST 8: RED - Test de suppression d'un produit
    test('should remove product from cart', () => {
      // Act
      const result = cartService.removeItem(testProduct.id);

      // Assert
      expect(result).toBe(true);
      expect(cartService.getItems()).toHaveLength(0);
      expect(cartService.isInCart(testProduct.id)).toBe(false);
    });

    // TEST 9: RED - Test de suppression d'un produit inexistant
    test('should handle removing non-existent product', () => {
      // Act
      const result = cartService.removeItem(999);

      // Assert
      expect(result).toBe(true);
      expect(cartService.getItems()).toHaveLength(1); // Original item still there
    });
  });

  describe('Updating quantities', () => {
    beforeEach(() => {
      cartService.addItem(testProduct, 2);
    });

    // TEST 10: RED - Test de mise à jour de quantité
    test('should update product quantity', () => {
      // Act
      const result = cartService.updateQuantity(testProduct.id, 5);

      // Assert
      expect(result).toBe(true);
      expect(cartService.getItemQuantity(testProduct.id)).toBe(5);
    });

    // TEST 11: RED - Test de suppression avec quantité 0
    test('should remove product when quantity is 0', () => {
      // Act
      const result = cartService.updateQuantity(testProduct.id, 0);

      // Assert
      expect(result).toBe(true);
      expect(cartService.isInCart(testProduct.id)).toBe(false);
    });

    // TEST 12: RED - Test de suppression avec quantité négative
    test('should remove product when quantity is negative', () => {
      // Act
      const result = cartService.updateQuantity(testProduct.id, -1);

      // Assert
      expect(result).toBe(true);
      expect(cartService.isInCart(testProduct.id)).toBe(false);
    });
  });

  describe('Cart summary', () => {
    // TEST 13: RED - Test de résumé panier vide
    test('should return correct summary for empty cart', () => {
      // Act
      const summary = cartService.getSummary();

      // Assert
      expect(summary.itemCount).toBe(0);
      expect(summary.totalPrice).toBe(0);
      expect(summary.totalItems).toBe(0);
      expect(summary.isEmpty).toBe(true);
    });

    // TEST 14: RED - Test de résumé avec produits
    test('should calculate correct summary with products', () => {
      // Arrange
      cartService.addItem(testProduct, 2);
      cartService.addItem({ ...testProduct, id: 2, prix: 10 }, 1);

      // Act
      const summary = cartService.getSummary();

      // Assert
      expect(summary.itemCount).toBe(3); // 2 + 1
      expect(summary.totalPrice).toBe(49.98); // (19.99 * 2) + (10 * 1)
      expect(summary.totalItems).toBe(2); // 2 distinct products
      expect(summary.isEmpty).toBe(false);
    });
  });

  describe('Utility methods', () => {
    // TEST 15: RED - Test de vérification présence produit
    test('should check if product is in cart', () => {
      // Arrange
      cartService.addItem(testProduct, 1);

      // Act & Assert
      expect(cartService.isInCart(testProduct.id)).toBe(true);
      expect(cartService.isInCart(999)).toBe(false);
    });

    // TEST 16: RED - Test de formatage prix
    test('should format price correctly', () => {
      // Act
      const formatted = cartService.formatPrice(19.99);

      // Assert
      expect(formatted).toMatch(/19,99\s*€/);
    });

    // TEST 17: RED - Test de vidage du panier
    test('should clear all items from cart', () => {
      // Arrange
      cartService.addItem(testProduct, 1);
      cartService.addItem({ ...testProduct, id: 2 }, 1);

      // Act
      cartService.clear();

      // Assert
      expect(cartService.getItems()).toHaveLength(0);
      expect(cartService.getSummary().isEmpty).toBe(true);
    });
  });

  describe('Listeners', () => {
    // TEST 18: RED - Test d'ajout de listeners
    test('should add and call listeners on cart changes', () => {
      // Arrange
      const mockListener = jest.fn();
      cartService.addListener(mockListener);

      // Act
      cartService.addItem(testProduct, 1);

      // Assert
      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          itemCount: 1,
          totalItems: 1
        })
      );
    });

    // TEST 19: RED - Test de suppression de listeners
    test('should remove listeners correctly', () => {
      // Arrange
      const mockListener = jest.fn();
      cartService.addListener(mockListener);
      cartService.removeListener(mockListener);

      // Act
      cartService.addItem(testProduct, 1);

      // Assert
      expect(mockListener).not.toHaveBeenCalled();
    });
  });
});

describe('CartOperations - TDD', () => {
  const testProduct = {
    id: 1,
    libelle: 'Produit Test',
    prix: 19.99,
    images: ['/test-image.jpg'],
    categorie: 'Test',
    stock: 50
  };

  beforeEach(() => {
    cartService.clear();
  });

  describe('Adding to cart with validation', () => {
    // TEST 20: RED - Test d'ajout valide
    test('should add product successfully', async () => {
      // Act
      const result = await cartOperations.addToCart(testProduct, 1);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toContain('ajouté au panier');
      expect(cartService.isInCart(testProduct.id)).toBe(true);
    });

    // TEST 21: RED - Test d'ajout avec produit invalide
    test('should reject invalid product', async () => {
      // Arrange
      const invalidProduct = { id: null, libelle: null };

      // Act
      const result = await cartOperations.addToCart(invalidProduct, 1);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('invalides');
    });

    // TEST 22: RED - Test de vérification stock
    test('should check stock availability', async () => {
      // Arrange
      cartService.addItem(testProduct, 49); // Near stock limit

      // Act
      const result = await cartOperations.addToCart(testProduct, 5);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('Stock insuffisant');
    });
  });

  describe('Removing from cart', () => {
    beforeEach(() => {
      cartService.addItem(testProduct, 1);
    });

    // TEST 23: RED - Test de suppression valide
    test('should remove product successfully', async () => {
      // Act
      const result = await cartOperations.removeFromCart(
        testProduct.id, 
        testProduct.libelle
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toContain('retiré du panier');
      expect(cartService.isInCart(testProduct.id)).toBe(false);
    });
  });

  describe('Checkout process', () => {
    // TEST 24: RED - Test de commande valide
    test('should process checkout successfully', async () => {
      // Arrange
      cartService.addItem(testProduct, 2);

      // Act
      const result = await cartOperations.checkout();

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toContain('succès');
      expect(result.data.orderId).toBeDefined();
      expect(cartService.getSummary().isEmpty).toBe(true);
    });

    // TEST 25: RED - Test de commande avec panier vide
    test('should reject checkout with empty cart', async () => {
      // Act
      const result = await cartOperations.checkout();

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('panier est vide');
    });
  });
}); 