/**
 * Shopping Cart page
 * Displays cart items with quantity management and total calculation
 */

import { cartService, cartOperations } from '../services/cart.js';
import { router } from '../utils/router.js';
import { auth } from '../utils/auth.js';
import { createNavbar, initializeNavbar, addNavbarStyles } from '../components/navbar.js';

/**
 * Create and render the cart page
 */
export function createCartPage() {
  const app = document.getElementById('app');
  const currentUser = auth.getCurrentUser();

  // Redirect to login if not authenticated
  if (!currentUser) {
    router.navigate('/login');
    return;
  }

  const cartSummary = cartService.getSummary();
  
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      ${createNavbar({ 
        currentPage: 'cart', 
        showBackButton: true, 
        backUrl: '/products', 
        pageTitle: 'Mon Panier' 
      })}

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        ${cartSummary.isEmpty ? renderEmptyCart() : renderCartContent(cartSummary)}
      </main>

      <!-- Toast Notifications -->
      <div id="toast-container" class="fixed bottom-4 right-4 z-50"></div>
    </div>
  `;

  // Initialize navbar and page functionality
  addNavbarStyles();
  initializeNavbar({ cartService });
  initializeCartPage();
}

/**
 * Render empty cart state
 */
function renderEmptyCart() {
  return `
    <div class="text-center py-16">
      <div class="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2L4 3H2m5 10v6a1 1 0 001 1h10a1 1 0 001-1v-6m-5-7v3"></path>
        </svg>
      </div>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        Découvrez notre catalogue de produits et ajoutez vos articles préférés à votre panier.
      </p>
      
      <div class="space-y-4">
        <button 
          onclick="router.navigate('/products')"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
        >
          🛍️ Découvrir nos produits
        </button>
        
        <div class="flex justify-center">
          <button 
            onclick="router.navigate('/')"
            class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render cart with items
 */
function renderCartContent(cartSummary) {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-2xl font-bold text-gray-900">
              Articles dans votre panier (${cartSummary.itemCount})
            </h2>
          </div>
          
          <div class="divide-y divide-gray-100">
            ${cartSummary.items.map(item => renderCartItem(item)).join('')}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button 
            onclick="router.navigate('/products')"
            class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            ← Continuer les achats
          </button>
          
          <button 
            id="clear-cart"
            class="flex-1 bg-red-100 text-red-700 px-6 py-3 rounded-xl hover:bg-red-200 transition-colors font-medium"
          >
            🗑️ Vider le panier
          </button>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        ${renderOrderSummary(cartSummary)}
      </div>
    </div>
  `;
}

/**
 * Render individual cart item
 */
function renderCartItem(item) {
  return `
    <div class="p-6 hover:bg-gray-50/50 transition-colors">
      <div class="flex gap-4">
        <!-- Product Image -->
        <div class="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src="${item.images ? item.images[0] : (item.image || '/placeholder-image.jpg')}" 
            alt="${item.libelle}"
            class="w-full h-full object-cover"
          >
        </div>

        <!-- Product Info -->
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
                ${item.libelle}
              </h3>
              <p class="text-sm text-gray-600">${item.categorie}</p>
            </div>
            
            <button 
              onclick="removeFromCart(${item.id}, '${item.libelle}')"
              class="text-red-500 hover:text-red-700 transition-colors ml-4"
              title="Retirer du panier"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>

          <div class="flex items-center justify-between">
            <!-- Quantity Controls -->
            <div class="flex items-center border border-gray-300 rounded-lg">
              <button 
                onclick="updateQuantity(${item.id}, ${item.quantity - 1}, '${item.libelle}')"
                class="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600"
                ${item.quantity <= 1 ? 'disabled' : ''}
              >
                -
              </button>
              <span class="px-4 py-1 text-center min-w-[3rem] font-medium">
                ${item.quantity}
              </span>
              <button 
                onclick="updateQuantity(${item.id}, ${item.quantity + 1}, '${item.libelle}')"
                class="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600"
                ${item.quantity >= item.stock ? 'disabled' : ''}
              >
                +
              </button>
            </div>

            <!-- Price -->
            <div class="text-right">
              <div class="text-lg font-bold text-gray-900">
                ${cartService.formatPrice(item.prix * item.quantity)}
              </div>
              <div class="text-sm text-gray-500">
                ${cartService.formatPrice(item.prix)} / unité
              </div>
            </div>
          </div>

          <!-- Stock Warning -->
          ${item.quantity >= item.stock ? `
            <div class="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              ⚠️ Stock maximum atteint (${item.stock} disponibles)
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render order summary
 */
function renderOrderSummary(cartSummary) {
  const deliveryFee = cartSummary.totalPrice > 50 ? 0 : 4.99;
  const total = cartSummary.totalPrice + deliveryFee;

  return `
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg sticky top-24">
      <div class="p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h3>
        
        <!-- Order Details -->
        <div class="space-y-4 mb-6">
          <div class="flex justify-between">
            <span class="text-gray-600">Sous-total (${cartSummary.itemCount} articles)</span>
            <span class="font-medium">${cartService.formatPrice(cartSummary.totalPrice)}</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-gray-600">Livraison</span>
            <span class="font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}">
              ${deliveryFee === 0 ? 'Gratuite' : cartService.formatPrice(deliveryFee)}
            </span>
          </div>
          
          ${deliveryFee > 0 ? `
            <div class="text-xs text-gray-500 bg-blue-50 p-2 rounded">
              💡 Livraison gratuite à partir de ${cartService.formatPrice(50)}
            </div>
          ` : ''}
          
          <hr class="border-gray-200">
          
          <div class="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span class="text-indigo-600">${cartService.formatPrice(total)}</span>
          </div>
        </div>

        <!-- Checkout Button -->
        <button 
          onclick="proceedToCheckout()"
          class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl mb-4"
        >
          🛒 Procéder au paiement
        </button>

        <!-- Additional Info -->
        <div class="text-xs text-gray-500 space-y-2">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Paiement sécurisé
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Livraison sous 2-3 jours
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Retour sous 30 jours
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize cart page functionality
 */
function initializeCartPage() {
  // Navigation (now handled by navbar component)
  // const backProducts = document.getElementById('back-products');
  // const homeBtn = document.getElementById('home-btn');
  const clearCartBtn = document.getElementById('clear-cart');

  // if (backProducts) {
  //   backProducts.addEventListener('click', () => router.navigate('/products'));
  // }

  // if (homeBtn) {
  //   homeBtn.addEventListener('click', () => router.navigate('/'));
  // }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', handleClearCart);
  }

  // Cart listener for real-time updates
  cartService.addListener(handleCartUpdate);
}

/**
 * Handle cart updates
 */
function handleCartUpdate() {
  // Refresh the page content
  setTimeout(() => {
    createCartPage();
  }, 100);
}

/**
 * Handle clear cart action
 */
function handleClearCart() {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    cartService.clearCart();
    showToast('Panier vidé avec succès', 'success');
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
window.removeFromCart = async function(productId, productName) {
  const result = await cartOperations.removeFromCart(productId, productName);
  if (result.success) {
    showToast(result.message, 'success');
  } else {
    showToast(result.message, 'error');
  }
};

window.updateQuantity = async function(productId, newQuantity, productName) {
  const result = await cartOperations.updateCartQuantity(productId, newQuantity, productName);
  if (result.success) {
    showToast(result.message, 'success');
  } else {
    showToast(result.message, 'error');
  }
};

window.proceedToCheckout = function() {
  showToast('Fonctionnalité de paiement à venir !', 'info');
  setTimeout(() => {
    alert('Dans une vraie application, vous seriez redirigé vers la page de paiement sécurisé.');
  }, 1000);
}; 