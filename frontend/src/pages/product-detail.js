/**
 * Product detail page
 * Displays detailed view of a single product with image gallery
 */

import { productsAPI } from '../services/products.js';
import { cartService, cartOperations } from '../services/cart.js';
import { router } from '../utils/router.js';
import { auth } from '../utils/auth.js';

let currentProduct = null;
let currentImageIndex = 0;

/**
 * Create and render the product detail page
 * @param {string} productId - Product ID from URL
 */
export function createProductDetailPage(productId) {
  const app = document.getElementById('app');
  
  // Show loading state first
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p class="text-gray-600">Chargement du produit...</p>
      </div>
    </div>
  `;

  // Load product data
  loadProduct(productId);
}

/**
 * Load product data from API
 */
async function loadProduct(productId) {
  try {
    const response = await productsAPI.getProductById(productId);

    if (response.success) {
      currentProduct = response.data;
      currentImageIndex = 0;
      renderProductDetail();
    } else {
      renderNotFound();
    }

  } catch (error) {
    console.error('Error loading product:', error);
    renderError();
  }
}

/**
 * Render the product detail page
 */
function renderProductDetail() {
  const app = document.getElementById('app');
  const currentUser = auth.getCurrentUser();
  const cartSummary = cartService.getSummary();

  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <!-- Navigation Header -->
      <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-3">
              <button id="back-products" class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                ← Retour aux produits
              </button>
              <div class="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">GP</span>
              </div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Détail Produit
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              ${currentUser ? `
                <button id="cart-btn" class="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
                  🛒 Panier
                  <span id="cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold ${cartSummary.itemCount > 0 ? '' : 'hidden'}">${cartSummary.itemCount}</span>
                </button>
                <span class="text-sm text-gray-700 font-medium">
                  ${currentUser.firstName}
                </span>
              ` : `
                <button id="login-link" class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  Se connecter
                </button>
              `}
            </div>
          </div>
        </div>
      </nav>

      <!-- Product Detail -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Image Gallery -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img 
                id="main-image"
                src="${currentProduct.images[currentImageIndex]}" 
                alt="${currentProduct.libelle}"
                class="w-full h-full object-cover"
              >
              ${currentProduct.featured ? `
                <div class="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-lg text-sm font-bold">
                  ⭐ Produit Vedette
                </div>
              ` : ''}
              
              <!-- Image Navigation -->
              ${currentProduct.images.length > 1 ? `
                <button id="prev-image" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
                  ←
                </button>
                <button id="next-image" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
                  →
                </button>
              ` : ''}
            </div>

            <!-- Thumbnail Images -->
            ${currentProduct.images.length > 1 ? `
              <div class="flex gap-3 overflow-x-auto pb-2">
                ${currentProduct.images.map((image, index) => `
                  <button 
                    onclick="changeImage(${index})"
                    class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-indigo-500' : 'border-gray-200 hover:border-gray-300'}"
                  >
                    <img src="${image}" alt="Vue ${index + 1}" class="w-full h-full object-cover">
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Category -->
            <div>
              <span class="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full font-medium">
                ${currentProduct.categorie}
              </span>
            </div>

            <!-- Title and Price -->
            <div>
              <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                ${currentProduct.libelle}
              </h1>
              <div class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ${cartService.formatPrice(currentProduct.prix)}
              </div>
            </div>

            <!-- Description -->
            <div class="prose max-w-none">
              <p class="text-gray-600 text-lg leading-relaxed">
                ${currentProduct.description}
              </p>
            </div>

            <!-- Stock Info -->
            <div class="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Disponibilité :</span>
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full ${currentProduct.stock > 10 ? 'bg-green-500' : currentProduct.stock > 0 ? 'bg-orange-500' : 'bg-red-500'} mr-2"></div>
                  <span class="font-medium ${currentProduct.stock > 10 ? 'text-green-700' : currentProduct.stock > 0 ? 'text-orange-700' : 'text-red-700'}">
                    ${currentProduct.stock > 10 ? 'En stock' : currentProduct.stock > 0 ? `${currentProduct.stock} restant(s)` : 'Rupture de stock'}
                  </span>
                </div>
              </div>
            </div>

            <!-- Quantity and Add to Cart -->
            ${currentUser ? `
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg">
                <div class="space-y-4">
                  <!-- Quantity Selector -->
                  <div class="flex items-center space-x-4">
                    <label class="text-gray-700 font-medium">Quantité :</label>
                    <div class="flex items-center border border-gray-300 rounded-lg">
                      <button id="qty-minus" class="px-3 py-2 hover:bg-gray-100 transition-colors" ${currentProduct.stock === 0 ? 'disabled' : ''}>-</button>
                      <input 
                        id="quantity" 
                        type="number" 
                        value="1" 
                        min="1" 
                        max="${currentProduct.stock}"
                        class="w-16 text-center border-0 focus:ring-0 bg-transparent"
                        ${currentProduct.stock === 0 ? 'disabled' : ''}
                      >
                      <button id="qty-plus" class="px-3 py-2 hover:bg-gray-100 transition-colors" ${currentProduct.stock === 0 ? 'disabled' : ''}>+</button>
                    </div>
                  </div>

                  <!-- Add to Cart Button -->
                  <button 
                    id="add-to-cart"
                    class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    ${currentProduct.stock === 0 ? 'disabled' : ''}
                  >
                    ${currentProduct.stock === 0 ? '❌ Rupture de stock' : cartService.isInCart(currentProduct.id) ? '✓ Ajouter de nouveau' : '🛒 Ajouter au panier'}
                  </button>

                  ${cartService.isInCart(currentProduct.id) ? `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div class="flex items-center">
                        <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span class="text-green-700 text-sm">
                          Ce produit est déjà dans votre panier (${cartService.getItemQuantity(currentProduct.id)})
                        </span>
                      </div>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : `
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-lg">
                <p class="text-gray-600 mb-4">Connectez-vous pour ajouter ce produit à votre panier</p>
                <button 
                  onclick="router.navigate('/login')"
                  class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Se connecter
                </button>
              </div>
            `}

            <!-- Additional Info -->
            <div class="bg-gray-50 rounded-xl p-6 space-y-3">
              <h3 class="font-semibold text-gray-900 mb-3">Informations produit</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">Catégorie :</span>
                  <span class="font-medium ml-2">${currentProduct.categorie}</span>
                </div>
                <div>
                  <span class="text-gray-600">ID Produit :</span>
                  <span class="font-medium ml-2">#${currentProduct.id}</span>
                </div>
                <div>
                  <span class="text-gray-600">Stock :</span>
                  <span class="font-medium ml-2">${currentProduct.stock} unités</span>
                </div>
                <div>
                  <span class="text-gray-600">État :</span>
                  <span class="font-medium ml-2">${currentProduct.featured ? 'Produit vedette' : 'Standard'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Toast Notifications -->
      <div id="toast-container" class="fixed bottom-4 right-4 z-50"></div>
    </div>
  `;

  // Initialize page functionality
  initializeProductDetail();
}

/**
 * Initialize product detail page functionality
 */
function initializeProductDetail() {
  // Navigation
  const backProducts = document.getElementById('back-products');
  const cartBtn = document.getElementById('cart-btn');
  const loginLink = document.getElementById('login-link');

  if (backProducts) {
    backProducts.addEventListener('click', () => router.navigate('/products'));
  }

  if (cartBtn) {
    cartBtn.addEventListener('click', () => router.navigate('/cart'));
  }

  if (loginLink) {
    loginLink.addEventListener('click', () => router.navigate('/login'));
  }

  // Image navigation
  const prevBtn = document.getElementById('prev-image');
  const nextBtn = document.getElementById('next-image');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => changeImage(currentImageIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => changeImage(currentImageIndex + 1));
  }

  // Quantity controls
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyInput = document.getElementById('quantity');

  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      const current = parseInt(qtyInput.value);
      if (current > 1) {
        qtyInput.value = current - 1;
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      const current = parseInt(qtyInput.value);
      if (current < currentProduct.stock) {
        qtyInput.value = current + 1;
      }
    });
  }

  // Add to cart functionality
  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', handleAddToCart);
  }

  // Cart listener
  cartService.addListener(updateCartCounter);
}

/**
 * Change main product image
 */
function changeImage(newIndex) {
  if (newIndex < 0) {
    currentImageIndex = currentProduct.images.length - 1;
  } else if (newIndex >= currentProduct.images.length) {
    currentImageIndex = 0;
  } else {
    currentImageIndex = newIndex;
  }

  const mainImage = document.getElementById('main-image');
  if (mainImage) {
    mainImage.src = currentProduct.images[currentImageIndex];
  }

  // Update thumbnail active state
  const thumbnails = document.querySelectorAll('[onclick*="changeImage"]');
  thumbnails.forEach((thumb, index) => {
    if (index === currentImageIndex) {
      thumb.classList.add('border-indigo-500');
      thumb.classList.remove('border-gray-200');
    } else {
      thumb.classList.remove('border-indigo-500');
      thumb.classList.add('border-gray-200');
    }
  });
}

/**
 * Handle add to cart action
 */
async function handleAddToCart() {
  const qtyInput = document.getElementById('quantity');
  const quantity = parseInt(qtyInput.value) || 1;

  const result = await cartOperations.addToCart(currentProduct, quantity);
  
  if (result.success) {
    showToast(result.message, 'success');
    // Re-render to update UI
    renderProductDetail();
  } else {
    showToast(result.message, 'error');
  }
}

/**
 * Update cart counter in navigation
 */
function updateCartCounter(cartSummary) {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cartSummary.itemCount;
    cartCount.style.display = cartSummary.itemCount > 0 ? 'flex' : 'none';
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg mb-2 transform translate-x-full transition-transform duration-300`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.remove('translate-x-full'), 100);
  
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => container.removeChild(toast), 300);
  }, 3000);
}

/**
 * Render not found page
 */
function renderNotFound() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div class="text-center">
        <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
        <p class="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
        <button 
          onclick="router.navigate('/products')"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          Voir tous les produits
        </button>
      </div>
    </div>
  `;
}

/**
 * Render error page
 */
function renderError() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div class="text-center">
        <div class="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Erreur de chargement</h1>
        <p class="text-gray-600 mb-6">Une erreur s'est produite lors du chargement du produit.</p>
        <div class="space-x-4">
          <button 
            onclick="window.location.reload()"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Réessayer
          </button>
          <button 
            onclick="router.navigate('/products')"
            class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Global function for onclick handlers
 */
window.changeImage = changeImage; 