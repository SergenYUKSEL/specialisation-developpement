/**
 * Cart service for managing shopping cart
 * Handles cart operations using localStorage for persistence
 */

/**
 * Cart service class
 */
class CartService {
  constructor() {
    this.items = [];
    this.listeners = [];
    this.storageKey = 'shopping_cart';
  }

  /**
   * Initialize cart service
   */
  init() {
    this.loadFromStorage();
    console.log('Cart service initialized');
  }

  /**
   * Add a listener for cart changes
   * @param {Function} callback - Callback function to call on cart changes
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove a listener
   * @param {Function} callback - Callback function to remove
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Notify all listeners of cart changes
   */
  notifyListeners() {
    const summary = this.getSummary();
    this.listeners.forEach(callback => callback(summary));
  }

  /**
   * Load cart from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.items = JSON.parse(stored);
        
        // Migrate old cart items structure
        this.items = this.items.map(item => {
          // Convert old 'image' property to 'images' array
          if (item.image && !item.images) {
            return {
              ...item,
              images: [item.image],
              stock: item.stock || 50
            };
          }
          
          // Ensure images is always an array
          if (!item.images || !Array.isArray(item.images)) {
            return {
              ...item,
              images: ['/placeholder-image.jpg'],
              stock: item.stock || 50
            };
          }
          
          // Ensure stock exists
          if (!item.stock) {
            return {
              ...item,
              stock: 50
            };
          }
          
          return item;
        });
        
        // Save the migrated data back to storage
        this.saveToStorage();
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.items = [];
    }
  }

  /**
   * Save cart to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  /**
   * Add item to cart
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add
   * @returns {boolean} Success status
   */
  addItem(product, quantity = 1) {
    try {
      const existingItem = this.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          id: product.id,
          libelle: product.libelle,
          prix: product.prix,
          images: product.images || ['/placeholder-image.jpg'],
          quantity: quantity,
          categorie: product.categorie,
          stock: product.stock || 50
        });
      }

      this.saveToStorage();
      this.notifyListeners();
      return true;

    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  }

  /**
   * Remove item from cart
   * @param {number} productId - Product ID to remove
   * @returns {boolean} Success status
   */
  removeItem(productId) {
    try {
      this.items = this.items.filter(item => item.id !== productId);
      this.saveToStorage();
      this.notifyListeners();
      return true;

    } catch (error) {
      console.error('Error removing item from cart:', error);
      return false;
    }
  }

  /**
   * Update item quantity
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {boolean} Success status
   */
  updateQuantity(productId, quantity) {
    try {
      const item = this.items.find(item => item.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          return this.removeItem(productId);
        } else {
          item.quantity = quantity;
          this.saveToStorage();
          this.notifyListeners();
        }
      }

      return true;

    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  }

  /**
   * Clear all items from cart
   */
  clear() {
    this.items = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Clear all items from cart (alias for backward compatibility)
   */
  clearCart() {
    this.clear();
  }

  /**
   * Get all cart items
   * @returns {Array} Cart items
   */
  getItems() {
    return [...this.items];
  }

  /**
   * Get cart summary
   * @returns {Object} Cart summary
   */
  getSummary() {
    const itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = this.items.reduce((total, item) => total + (item.prix * item.quantity), 0);

    return {
      itemCount,
      totalPrice,
      totalItems: this.items.length,
      items: this.getItems(),
      isEmpty: this.items.length === 0
    };
  }

  /**
   * Check if product is in cart
   * @param {number} productId - Product ID
   * @returns {boolean} True if product is in cart
   */
  isInCart(productId) {
    return this.items.some(item => item.id === productId);
  }

  /**
   * Get item quantity in cart
   * @param {number} productId - Product ID
   * @returns {number} Quantity in cart
   */
  getItemQuantity(productId) {
    const item = this.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }

  /**
   * Format price for display
   * @param {number} price - Price to format
   * @returns {string} Formatted price
   */
  formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
}

/**
 * Cart operations with user feedback
 */
export const cartOperations = {
  /**
   * Add product to cart with feedback
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add
   * @returns {Object} Operation result
   */
  async addToCart(product, quantity = 1) {
    try {
      // Check if product has required properties
      if (!product || !product.id || !product.libelle || !product.prix) {
        return {
          success: false,
          message: 'Données du produit invalides'
        };
      }

      // Check stock (mock validation since backend doesn't have stock)
      const currentQuantity = cartService.getItemQuantity(product.id);
      const maxStock = product.stock || 50; // Default stock
      
      if (currentQuantity + quantity > maxStock) {
        return {
          success: false,
          message: `Stock insuffisant. Maximum disponible: ${maxStock - currentQuantity}`
        };
      }

      const success = cartService.addItem(product, quantity);
      
      if (success) {
        return {
          success: true,
          message: `${product.libelle} ajouté au panier`
        };
      } else {
        return {
          success: false,
          message: 'Erreur lors de l\'ajout au panier'
        };
      }

    } catch (error) {
      console.error('Error in addToCart operation:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'ajout au panier'
      };
    }
  },

  /**
   * Remove product from cart with feedback
   * @param {number} productId - Product ID to remove
   * @param {string} productName - Product name for feedback message
   * @returns {Object} Operation result
   */
  async removeFromCart(productId, productName = 'Produit') {
    try {
      const success = cartService.removeItem(productId);
      
      if (success) {
        return {
          success: true,
          message: `${productName} retiré du panier`
        };
      } else {
        return {
          success: false,
          message: 'Erreur lors de la suppression'
        };
      }

    } catch (error) {
      console.error('Error in removeFromCart operation:', error);
      return {
        success: false,
        message: 'Erreur lors de la suppression'
      };
    }
  },

  /**
   * Update quantity with feedback
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   * @param {string} productName - Product name for feedback message
   * @returns {Object} Operation result
   */
  async updateCartQuantity(productId, quantity, productName = 'Produit') {
    try {
      const success = cartService.updateQuantity(productId, quantity);
      
      if (success) {
        return {
          success: true,
          message: `Quantité de ${productName} mise à jour`
        };
      } else {
        return {
          success: false,
          message: 'Erreur lors de la mise à jour'
        };
      }

    } catch (error) {
      console.error('Error in updateCartQuantity operation:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour'
      };
    }
  },

  /**
   * Update quantity with feedback (alias for backward compatibility)
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {Object} Operation result
   */
  async updateQuantity(productId, quantity) {
    return this.updateCartQuantity(productId, quantity);
  },

  /**
   * Simulate checkout process
   * @returns {Object} Checkout result
   */
  async checkout() {
    try {
      const summary = cartService.getSummary();
      
      if (summary.itemCount === 0) {
        return {
          success: false,
          message: 'Le panier est vide'
        };
      }

      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear cart after successful checkout
      cartService.clear();

      return {
        success: true,
        message: 'Commande passée avec succès !',
        data: {
          orderId: 'ORDER-' + Date.now(),
          total: summary.totalPrice,
          itemCount: summary.itemCount
        }
      };

    } catch (error) {
      console.error('Error in checkout operation:', error);
      return {
        success: false,
        message: 'Erreur lors de la commande'
      };
    }
  }
};

// Create singleton instance
export const cartService = new CartService(); 