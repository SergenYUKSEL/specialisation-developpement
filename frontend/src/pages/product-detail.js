/**
 * Product detail page
 * Displays detailed view of a single product with image gallery
 */

import { productsAPI } from '../services/products.js';
import { cartService, cartOperations } from '../services/cart.js';
import { router } from '../utils/router.js';
import { auth } from '../utils/auth.js';
import { createNavbar, initializeNavbar, addNavbarStyles } from '../components/navbar.js';
import { showProductFormModal } from '../components/product-form-modal.js';

let currentProduct = null;
let currentImageIndex = 0;

function getPlaceholderImage() {
  return '/placeholder.png'; // Place ce fichier dans public/ ou adapte l'URL
}

function parseImageUrls(imageUrls) {
  if (!imageUrls) return [getPlaceholderImage()];
  if (Array.isArray(imageUrls)) {
    const urls = imageUrls
      .filter(url => typeof url === 'string' && url.trim() !== '')
      .map(url => url.startsWith('http') ? url : `http://localhost:3000/images/${url}`);
    return urls.length > 0 ? urls : [getPlaceholderImage()];
  }
  if (typeof imageUrls === 'string' && imageUrls.trim() !== '') {
    return [imageUrls.startsWith('http') ? imageUrls : `http://localhost:3000/images/${imageUrls}`];
  }
  return [getPlaceholderImage()];
}

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

  loadProduct(productId);
}

async function loadProduct(productId) {
  try {
    const response = await productsAPI.getProductById(productId);
    if (response.success) {
      currentProduct = response.data;
      // Correction : transformer image_url en tableau d'URLs utilisables
      currentProduct.images = parseImageUrls(currentProduct.image_url);
      renderProductDetail();
    } else {
      renderError();
    }
  } catch (error) {
    renderError();
  }
}

function renderProductDetail() {
  const app = document.getElementById('app');
  const currentUser = auth.getCurrentUser();
  const cartSummary = cartService.getSummary();

  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      ${createNavbar({ 
        currentPage: 'product-detail', 
        showBackButton: true, 
        backUrl: '/products', 
        pageTitle: 'Détail Produit' 
      })}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col lg:flex-row gap-8">
          <!-- Images & Gallery -->
          <div class="flex-1 flex flex-col items-center">
            <div class="relative w-72 h-72 rounded-xl overflow-hidden bg-gray-100 mb-4">
              <img src="${currentProduct.images[0]}" alt="${currentProduct.libelle}" class="w-full h-full object-cover" />
              ${currentProduct.images.length > 1 ? `
                <button id="prev-image" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white">
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button id="next-image" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white">
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              ` : ''}
            </div>
            <div class="flex gap-2 mt-2">
              ${currentProduct.images.map((img, idx) => `
                <button class="w-12 h-12 rounded-lg overflow-hidden border-2 ${idx === currentImageIndex ? 'border-indigo-600' : 'border-transparent'} focus:outline-none" data-image-idx="${idx}">
                  <img src="${img}" alt="Miniature" class="w-full h-full object-cover" />
                  </button>
                `).join('')}
              </div>
          </div>
          <!-- Infos produit -->
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <span class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium mb-2">
                ${currentProduct.categorie}
              </span>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                ${currentProduct.libelle}
              </h2>
              <p class="text-gray-600 mb-4">
                ${currentProduct.description}
              </p>
              <div class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                ${cartService.formatPrice(currentProduct.prix)}
            </div>
              <div class="text-sm text-gray-500 mb-4">
                Stock: ${currentProduct.stock}
              </div>
            </div>
            <div class="space-y-4 mt-6">
              <!-- Bouton Ajouter au panier (toujours visible) -->
              <button 
                onclick="addToCart(${currentProduct.id})"
                class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium ${cartService.isInCart(currentProduct.id) ? 'opacity-60 cursor-not-allowed' : ''}"
                ${cartService.isInCart(currentProduct.id) ? 'disabled' : ''}
              >
                ${cartService.isInCart(currentProduct.id) ? '✓ Dans le panier' : '🛒 Ajouter au panier'}
              </button>

              <!-- Boutons de gestion (modification et suppression) -->
              ${currentUser ? `
                <div class="flex gap-3">
                  <button 
                    id="edit-product-btn" 
                    class="flex-1 bg-white border border-indigo-600 text-indigo-700 px-4 py-3 rounded-lg hover:bg-indigo-50 transition-all font-medium flex items-center justify-center"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Modifier
                  </button>
                  
                  <button 
                    id="delete-product-btn" 
                    class="flex-1 bg-white border border-red-600 text-red-700 px-4 py-3 rounded-lg hover:bg-red-50 transition-all font-medium flex items-center justify-center"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Supprimer
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </main>
      <div id="toast-container" class="fixed bottom-4 right-4 z-50"></div>
    </div>
  `;

  // Initialize navbar and page functionality
  addNavbarStyles();
  initializeNavbar({ cartService });
  initializeProductDetail();
}

function initializeProductDetail() {
  // Navigation (now handled by navbar component)
  // const backProducts = document.getElementById('back-products');
  // const cartBtn = document.getElementById('cart-btn');
  // const loginLink = document.getElementById('login-link');

  // if (backProducts) {
  //   backProducts.addEventListener('click', () => router.navigate('/products'));
  // }

  // if (cartBtn) {
  //   cartBtn.addEventListener('click', () => router.navigate('/cart'));
  // }

  // if (loginLink) {
  //   loginLink.addEventListener('click', () => router.navigate('/login'));
  // }

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

  // Bouton modifier
  const editBtn = document.getElementById('edit-product-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      // Vérifier que l'utilisateur est connecté
      const currentUser = auth.getCurrentUser();
      if (!currentUser) {
        showToast('Vous devez être connecté pour modifier un produit', 'error');
        router.navigate('/login');
        return;
      }

      showProductFormModal({ 
        mode: 'edit', 
        product: { ...currentProduct, images: currentProduct.image_url }, 
        onSuccess: () => {
          showToast('Produit modifié avec succès !', 'success');
          setTimeout(() => window.location.reload(), 1000);
        }
      });
    });
  }

  // Bouton supprimer
  const deleteBtn = document.getElementById('delete-product-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', handleDeleteProduct);
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
 * Handle delete product action
 */
async function handleDeleteProduct() {
  // Vérifier que l'utilisateur est connecté
  const currentUser = auth.getCurrentUser();
  if (!currentUser) {
    showToast('Vous devez être connecté pour supprimer un produit', 'error');
    router.navigate('/login');
    return;
  }

  // Confirmation de suppression avec double vérification
  const firstConfirm = confirm(
    `Êtes-vous sûr de vouloir supprimer le produit "${currentProduct.libelle}" ?\n\nCette action est irréversible.`
  );

  if (!firstConfirm) {
    return;
  }

  const secondConfirm = confirm(
    `ATTENTION: Vous allez définitivement supprimer "${currentProduct.libelle}".\n\nTapez le nom du produit pour confirmer ou cliquez sur Annuler.`
  );

  if (!secondConfirm) {
    return;
  }

  try {
    // Désactiver le bouton pendant la suppression
    const deleteBtn = document.getElementById('delete-product-btn');
    if (deleteBtn) {
      deleteBtn.disabled = true;
      deleteBtn.innerHTML = `
        <svg class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Suppression...
      `;
    }

    const response = await productsAPI.deleteProduct(currentProduct.id);

    if (response.success) {
      showToast('Produit supprimé avec succès !', 'success');
      
      // Rediriger vers la liste des produits après 1.5 secondes
      setTimeout(() => {
        router.navigate('/products');
      }, 1500);
      
    } else {
      throw new Error(response.message || 'Erreur lors de la suppression');
    }

  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    
    // Gestion spécifique des erreurs d'authentification
    if (error.message && error.message.includes('Token manquant')) {
      showToast('Session expirée. Veuillez vous reconnecter.', 'error');
      setTimeout(() => {
        auth.logout();
        router.navigate('/login');
      }, 2000);
      return;
    }
    
    showToast('Erreur lors de la suppression du produit', 'error');
    
    // Réactiver le bouton en cas d'erreur
    const deleteBtn = document.getElementById('delete-product-btn');
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        Supprimer
      `;
    }
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
 * Global functions for onclick handlers
 */
window.changeImage = changeImage;

window.addToCart = async function(productId) {
  const result = await cartOperations.addToCart(currentProduct, 1);
  
  if (result.success) {
    showToast(result.message, 'success');
    // Re-render to update UI
    renderProductDetail();
  } else {
    showToast(result.message, 'error');
  }
}; 