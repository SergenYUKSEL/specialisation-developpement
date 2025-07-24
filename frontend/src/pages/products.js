/**
 * Products listing page
 * Displays all products with search and filtering capabilities
 */

import { productsAPI, categoriesAPI } from '../services/products.js';
import { cartService, cartOperations } from '../services/cart.js';
import { router } from '../utils/router.js';
import { auth } from '../utils/auth.js';
import { createNavbar, initializeNavbar, addNavbarStyles } from '../components/navbar.js';

let currentProducts = [];
let currentFilters = {};
let isLoading = false;
let availableCategories = [];

/**
 * Create and render the products page
 */
export function createProductsPage() {
  const app = document.getElementById('app');
  const currentUser = auth.getCurrentUser();
  
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      ${createNavbar({ 
        currentPage: 'products', 
        showBackButton: true, 
        backUrl: '/', 
        pageTitle: 'Catalogue Produits' 
      })}

      <!-- Filters and Search -->
      <section class="bg-white/50 backdrop-blur-sm border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col lg:flex-row gap-6 items-center">
            <!-- Search -->
            <div class="flex-1 max-w-md">
              <div class="relative">
                <input
                  type="text"
                  id="search-input"
                  placeholder="Rechercher des produits..."
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 backdrop-blur-sm"
                >
                <svg class="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Category Filter -->
            <div id="category-filters" class="flex flex-wrap gap-3">
              <button data-category="" class="filter-btn active px-4 py-2 rounded-lg font-medium transition-all bg-indigo-600 text-white border border-indigo-600">
                Tout
              </button>
              <!-- Categories will be loaded dynamically -->
            </div>

            <!-- Sort Options -->
            <div>
              <select id="sort-select" class="px-4 py-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500">
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Products Grid -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Loading State -->
        <div id="loading" class="text-center py-12 hidden">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p class="mt-4 text-gray-600">Chargement des produits...</p>
        </div>

        <!-- Products Grid -->
        <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <!-- Products will be inserted here -->
        </div>

        <!-- No Results -->
        <div id="no-results" class="text-center py-12 hidden">
          <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
          <p class="text-gray-500">Essayez de modifier vos critères de recherche</p>
        </div>
      </main>

      <!-- Toast Notifications -->
      <div id="toast-container" class="fixed bottom-4 right-4 z-50"></div>
    </div>
  `;

  // Initialize navbar and page functionality
  addNavbarStyles();
  initializeNavbar({ cartService });
  initializeProductsPage();
  loadCategories();
  loadProducts();
}

/**
 * Load and display categories from JSON file
 */
async function loadCategories() {
  try {
    const response = await categoriesAPI.getAllCategories();
    
    if (response.success) {
      availableCategories = response.data;
      renderCategoryFilters();
    } else {
      console.error('Error loading categories:', response.message);
    }

  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

/**
 * Render category filter buttons
 */
function renderCategoryFilters() {
  const categoryFilters = document.getElementById('category-filters');
  
  if (!categoryFilters) return;

  // Keep the "Tout" button and add category buttons
  const categoryButtons = availableCategories.map(category => `
    <button data-category="${category.name}" class="filter-btn px-4 py-2 rounded-lg font-medium transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
      ${category.name}
    </button>
  `).join('');

  // Add category buttons after the "Tout" button
  const toutButton = categoryFilters.querySelector('[data-category=""]');
  if (toutButton) {
    toutButton.insertAdjacentHTML('afterend', categoryButtons);
  }

  // Re-initialize category filter events
  initializeCategoryFilters();
}

/**
 * Initialize category filter events
 */
function initializeCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
        b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
      });
      
      btn.classList.add('active');
      btn.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
      btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');

      // Apply filter
      const category = btn.dataset.category;
      currentFilters.category = category || undefined;
      loadProducts();
    });
  });
}

/**
 * Initialize products page functionality
 */
function initializeProductsPage() {
  // Navigation (now handled by navbar component)
  // const backHome = document.getElementById('back-home');
  // const cartBtn = document.getElementById('cart-btn');
  // const loginLink = document.getElementById('login-link');

  // if (backHome) {
  //   backHome.addEventListener('click', () => router.navigate('/'));
  // }

  // if (cartBtn) {
  //   cartBtn.addEventListener('click', () => router.navigate('/cart'));
  // }

  // if (loginLink) {
  //   loginLink.addEventListener('click', () => router.navigate('/login'));
  // }

  // Search functionality
  const searchInput = document.getElementById('search-input');
  let searchTimeout;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentFilters.search = e.target.value.trim();
      loadProducts();
    }, 300);
  });

  // Sort functionality
  const sortSelect = document.getElementById('sort-select');
  sortSelect.addEventListener('change', (e) => {
    currentFilters.sort = e.target.value;
    loadProducts();
  });

  // Cart listener (now handled by navbar)
  // cartService.addListener(updateCartCounter);
  // updateCartCounter(cartService.getSummary());
}

/**
 * Load and display products
 */
async function loadProducts() {
  if (isLoading) return;

  isLoading = true;
  showLoading(true);

  try {
    const response = await productsAPI.getAllProducts(currentFilters);

    if (response.success) {
      currentProducts = response.data;
      applySorting();
      displayProducts(currentProducts);
    } else {
      showToast('Erreur lors du chargement des produits', 'error');
    }

  } catch (error) {
    console.error('Error loading products:', error);
    showToast('Erreur de connexion', 'error');

  } finally {
    isLoading = false;
    showLoading(false);
  }
}

/**
 * Apply sorting to current products
 */
function applySorting() {
  const sortBy = currentFilters.sort || 'name-asc';

  currentProducts.sort((a, b) => {
    switch (sortBy) {
      case 'name-desc':
        return b.libelle.localeCompare(a.libelle);
      case 'price-asc':
        return a.prix - b.prix;
      case 'price-desc':
        return b.prix - a.prix;
      case 'name-asc':
      default:
        return a.libelle.localeCompare(b.libelle);
    }
  });
}

/**
 * Display products in grid
 */
function displayProducts(products) {
  const grid = document.getElementById('products-grid');
  const noResults = document.getElementById('no-results');

  if (products.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  grid.innerHTML = products.map(product => `
    <div class="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <!-- Product Image -->
      <div class="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src="${product.images[0]}" 
          alt="${product.libelle}"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        >
        ${product.featured ? `
          <div class="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            ⭐ Vedette
          </div>
        ` : ''}
        <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-semibold text-gray-700">
          ${cartService.formatPrice(product.prix)}
        </div>
      </div>

      <!-- Product Info -->
      <div class="p-6">
        <div class="mb-2">
          <span class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
            ${product.categorie}
          </span>
        </div>
        
        <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          ${product.libelle}
        </h3>
        
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">
          ${product.description}
        </p>

        <div class="flex items-center justify-between mb-4">
          <div class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ${cartService.formatPrice(product.prix)}
          </div>
          <div class="text-sm text-gray-500">
            Stock: ${product.stock}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button 
            onclick="viewProduct(${product.id})"
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Voir détails
          </button>
          ${auth.getCurrentUser() ? `
            <button 
              onclick="addToCart(${product.id})"
              class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium"
              ${cartService.isInCart(product.id) ? 'disabled' : ''}
            >
              ${cartService.isInCart(product.id) ? '✓ Dans le panier' : '🛒 Ajouter'}
            </button>
          ` : `
            <button 
              onclick="router.navigate('/login')"
              class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
            >
              Se connecter
            </button>
          `}
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Update cart counter in navigation (now handled by navbar component)
 */
// function updateCartCounter(cartSummary) {
//   const cartCount = document.getElementById('cart-count');
//   if (cartCount) {
//     cartCount.textContent = cartSummary.itemCount;
//     cartCount.style.display = cartSummary.itemCount > 0 ? 'flex' : 'none';
//   }
// }

/**
 * Show/hide loading state
 */
function showLoading(show) {
  const loading = document.getElementById('loading');
  const grid = document.getElementById('products-grid');
  
  if (show) {
    loading.classList.remove('hidden');
    grid.classList.add('opacity-50');
  } else {
    loading.classList.add('hidden');
    grid.classList.remove('opacity-50');
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg mb-2 transform translate-x-full transition-transform duration-300`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Slide in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

/**
 * Global functions for onclick handlers
 */
window.viewProduct = function(productId) {
  router.navigate(`/product/${productId}`);
};

window.addToCart = async function(productId) {
  const product = currentProducts.find(p => p.id === productId);
  if (!product) return;

  const result = await cartOperations.addToCart(product, 1);
  
  if (result.success) {
    showToast(result.message, 'success');
    // Refresh the display to update button states
    displayProducts(currentProducts);
  } else {
    showToast(result.message, 'error');
  }
}; 