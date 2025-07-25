/**
 * Products API service
 * Handles communication with the backend products endpoints
 */

import { apiRequest } from './api.js';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Safely parse image URL field from backend
 * @param {string} imageUrl - Raw image_url field from backend
 * @returns {Array} Array of image URLs
 */
function parseImageUrls(imageUrl) {
  let images = ['/placeholder-image.jpg']; // Default fallback
  
  if (!imageUrl) {
    return images;
  }

  try {
    // Try to parse as JSON first (for arrays of filenames)
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed)) {
      images = parsed.map(filename => {
        // If it's a filename, prepend the server URL
        if (filename && !filename.startsWith('http')) {
          return `http://localhost:3000/images/${filename}`;
        }
        return filename || '/placeholder-image.jpg';
      });
    } else {
      images = [parsed || '/placeholder-image.jpg'];
    }
  } catch (error) {
    // If JSON.parse fails, treat it as a single URL or filename
    if (typeof imageUrl === 'string') {
      if (imageUrl.startsWith('http')) {
        // It's already a full URL
        images = [imageUrl];
      } else {
        // It's a filename, prepend server URL
        images = [`http://localhost:3000/images/${imageUrl}`];
      }
    }
  }

  return images;
}

/**
 * Products API endpoints
 */
export const productsAPI = {
  /**
   * Get all products with optional filters
   * @param {Object} filters - Optional filters
   * @param {string} filters.search - Search term
   * @param {string} filters.category - Category filter
   * @param {string} filters.sort - Sort option
   * @returns {Promise<Object>} Products data
   */
  async getAllProducts(filters = {}) {
    try {
      // First, get all products from backend (no server-side filtering since backend doesn't support it)
      const response = await apiRequest('/products');

      if (!response.success) {
        return response;
      }

      // Transform backend data to frontend format
      let transformedData = response.data.map(product => ({
        id: product.id,
        libelle: product.libelle,
        description: product.description,
        prix: parseFloat(product.prix),
        categorie: product.category_name || 'Non catégorisé',
        images: parseImageUrls(product.image_url),
        stock: 50, // Default stock since not in backend
        featured: false // Default featured status
      }));

      // Apply client-side filtering
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        transformedData = transformedData.filter(product => 
          product.libelle.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.categorie.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.category && filters.category !== '') {
        transformedData = transformedData.filter(product => 
          product.categorie === filters.category
        );
      }

      // Client-side sorting is handled separately in the calling code
      return {
        success: true,
        data: transformedData
      };

    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        message: 'Erreur lors du chargement des produits'
      };
    }
  },

  /**
   * Get a single product by ID
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getProductById(productId) {
    try {
      const response = await apiRequest(`/products/${productId}`);

      if (response.success) {
        // Transform backend data to frontend format
        const product = response.data;

        const transformedData = {
          id: product.id,
          libelle: product.libelle,
          description: product.description,
          prix: parseFloat(product.prix),
          categorie: product.category_name || 'Non catégorisé',
          images: parseImageUrls(product.image_url),
          stock: 50, // Default stock since not in backend
          featured: false // Default featured status
        };

        return {
          success: true,
          data: transformedData
        };
      }

      return response;

    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        success: false,
        message: 'Erreur lors du chargement du produit'
      };
    }
  },

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product data
   */
  async createProduct(productData) {
    try {
      // Transform frontend data to backend format
      const backendData = {
        libelle: productData.libelle,
        description: productData.description,
        prix: productData.prix,
        image_url: productData.image_url,
        category_name: productData.category_name
      };

      const response = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(backendData)
      });

      return response;

    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        message: 'Erreur lors de la création du produit'
      };
    }
  },

  /**
   * Update a product
   * @param {number} productId - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product data
   */
  async updateProduct(productId, productData) {
    try {
      // Transform frontend data to backend format
      const backendData = {
        libelle: productData.libelle,
        description: productData.description,
        prix: productData.prix,
        image_url: productData.image_url,
        category_name: productData.category_name
      };

      const response = await apiRequest(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(backendData)
      });

      return response;

    } catch (error) {
      console.error('Error updating product:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour du produit'
      };
    }
  },

  /**
   * Delete a product
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Response
   */
  async deleteProduct(productId) {
    try {
      const response = await apiRequest(`/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      return response;

    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        message: 'Erreur lors de la suppression du produit'
      };
    }
  }
};

/**
 * Categories API endpoints
 */
export const categoriesAPI = {
  /**
   * Get all categories from local JSON file
   * @returns {Promise<Object>} Categories data
   */
  async getAllCategories() {
    try {
      const res = await fetch('http://localhost:3000/api/categories');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      return { success: false, message: 'Erreur chargement catégories' };
    }
  },

  /**
   * Get category names for filtering
   * @returns {Promise<Array>} Array of category names
   */
  async getCategoryNames() {
    try {
      const response = await this.getAllCategories();
      
      if (response.success) {
        return response.data.map(category => category.name);
      }
      
      return [];

    } catch (error) {
      console.error('Error getting category names:', error);
      return [];
    }
  },

  /**
   * Create a new category (backend only)
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category data
   */
  async createCategory(categoryData) {
    try {
      const response = await apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });

      return response;

    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        message: 'Erreur lors de la création de la catégorie'
      };
    }
  }
};

/**
 * Statistics API for dashboard
 */
export const statsAPI = {
  /**
   * Get category statistics from backend
   * @returns {Promise<Object>} Category statistics data
   */
  async getCategoryStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('Error fetching category statistics:', error);
      return {
        success: false,
        message: 'Erreur lors du chargement des statistiques de catégories',
        error: error.message
      };
    }
  },

  /**
   * Get products statistics
   * @returns {Promise<Object>} Statistics data
   */
  async getProductsStats() {
    try {
      // Since the backend doesn't have specific stats endpoints,
      // we'll fetch products and categories to generate stats
      const [productsResponse, categoriesResponse] = await Promise.all([
        productsAPI.getAllProducts(),
        categoriesAPI.getAllCategories()
      ]);

      if (!productsResponse.success || !categoriesResponse.success) {
        throw new Error('Erreur lors du chargement des statistiques');
      }

      const products = productsResponse.data;
      const categories = categoriesResponse.data;

      // Generate statistics
      const stats = {
        totalProducts: products.length,
        totalCategories: categories.length,
        productsByCategory: {},
        averagePrice: 0,
        maxPrice: 0,
        minPrice: 0
      };

      if (products.length > 0) {
        // Calculate price statistics
        const prices = products.map(p => parseFloat(p.prix));
        stats.averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        stats.maxPrice = Math.max(...prices);
        stats.minPrice = Math.min(...prices);

        // Count products by category
        products.forEach(product => {
          const category = product.categorie;
          stats.productsByCategory[category] = (stats.productsByCategory[category] || 0) + 1;
        });
      }

      return {
        success: true,
        data: stats
      };

    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        success: false,
        message: 'Erreur lors du chargement des statistiques'
      };
    }
  }
}; 