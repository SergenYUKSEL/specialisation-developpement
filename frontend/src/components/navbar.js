/**
 * Navbar component
 * Reusable navigation bar for all pages
 */

import { auth } from '../utils/auth.js';
import { router } from '../utils/router.js';

/**
 * Create and render the navigation bar
 * @param {Object} options - Configuration options
 * @param {string} options.currentPage - Current page identifier for active state
 * @param {boolean} options.showBackButton - Whether to show back button
 * @param {string} options.backUrl - URL for back button
 * @param {string} options.pageTitle - Optional page title to display
 * @returns {string} HTML string for the navbar
 */
export function createNavbar(options = {}) {
  const { 
    currentPage = '', 
    showBackButton = false, 
    backUrl = '/', 
    pageTitle = '' 
  } = options;
  
  const currentUser = auth.getCurrentUser();
  
  return `
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side: Logo and navigation -->
          <div class="flex items-center space-x-4">
            ${showBackButton ? `
              <button id="nav-back-btn" class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span>Retour</span>
              </button>
            ` : ''}
            
            <div class="flex items-center space-x-3">
              <button id="nav-home" class="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform">
                <span class="text-white font-bold text-sm">GP</span>
              </button>
              <div class="flex flex-col">
                <h1 class="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${pageTitle || 'Gestion de Produits'}
                </h1>
                ${pageTitle ? `
                  <span class="text-xs text-gray-500">Gestion de Produits</span>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Center: Navigation links (for authenticated users) -->
          ${currentUser ? `
            <div class="hidden md:flex items-center space-x-6">
              <a href="#" id="nav-home-link" class="nav-link ${currentPage === 'home' ? 'active' : ''} text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors relative">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Accueil
              </a>
              <a href="#" id="nav-products-link" class="nav-link ${currentPage === 'products' ? 'active' : ''} text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors relative">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                Produits
              </a>
              <a href="#" id="nav-cart-link" class="nav-link ${currentPage === 'cart' ? 'active' : ''} text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors relative">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5m6-5H7"></path>
                </svg>
                Panier
                <span id="nav-cart-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold hidden">0</span>
              </a>
              <a href="#" id="nav-stats-link" class="nav-link ${currentPage === 'statistics' ? 'active' : ''} text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Statistiques
              </a>
              <a href="#" id="nav-dashboard-link" class="nav-link ${currentPage === 'dashboard' ? 'active' : ''} text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h4a2 2 0 002-2V7a2 2 0 00-2-2h-4a2 2 0 00-2 2m6 0V17"></path>
                </svg>
                Dashboard
              </a>
            </div>
          ` : ''}

          <!-- Right side: User menu or auth buttons -->
          <div class="flex items-center space-x-4">
            ${currentUser ? `
              <!-- User Menu -->
              <div class="relative">
                <button id="nav-user-menu" class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-2 hover:bg-gray-50 transition-colors">
                  <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-medium">
                      ${currentUser.firstName ? currentUser.firstName.charAt(0) : 'U'}${currentUser.pseudo ? currentUser.pseudo.charAt(0) : ''}
                    </span>
                  </div>
                  <span class="hidden sm:block text-gray-700 font-medium">
                    ${currentUser.firstName || currentUser.pseudo || 'Utilisateur'}
                  </span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <!-- Dropdown Menu -->
                <div id="nav-user-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div class="py-1">
                    <div class="px-4 py-2 text-sm text-gray-700 border-b">
                      <div class="font-medium">${currentUser.firstName || currentUser.pseudo || 'Utilisateur'}</div>
                      <div class="text-gray-500">${currentUser.email || ''}</div>
                    </div>
                    <a href="#" id="nav-profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Mon Profil
                    </a>
                    <a href="#" id="nav-settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Paramètres
                    </a>
                    <hr class="my-1">
                    <button id="nav-logout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            ` : `
              <!-- Auth Buttons -->
              <div class="flex items-center space-x-3">
                <button id="nav-login" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  Connexion
                </button>
                <button id="nav-register" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                  S'inscrire
                </button>
              </div>
            `}
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button id="nav-mobile-menu" class="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path id="nav-mobile-menu-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div id="nav-mobile-panel" class="hidden md:hidden bg-white border-t border-gray-200">
        <div class="px-4 pt-2 pb-3 space-y-1">
          ${currentUser ? `
            <a href="#" id="nav-mobile-home" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors">
              Accueil
            </a>
            <a href="#" id="nav-mobile-products" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors">
              Produits
            </a>
            <a href="#" id="nav-mobile-cart" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors">
              Panier
            </a>
            <a href="#" id="nav-mobile-stats" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors">
              Statistiques
            </a>
            <a href="#" id="nav-mobile-dashboard" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors">
              Dashboard
            </a>
            <hr class="my-2">
            <button id="nav-mobile-logout" class="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
              Déconnexion
            </button>
          ` : `
            <a href="#" id="nav-mobile-login" class="block px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
              Connexion
            </a>
            <a href="#" id="nav-mobile-register" class="block px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
              S'inscrire
            </a>
          `}
        </div>
      </div>
    </nav>
  `;
}

/**
 * Initialize navbar event listeners
 * @param {Object} options - Configuration options
 */
export function initializeNavbar(options = {}) {
  const { onNavigate, cartService } = options;

  // Navigation events
  const navHome = document.getElementById('nav-home');
  const navBackBtn = document.getElementById('nav-back-btn');
  const navHomeLink = document.getElementById('nav-home-link');
  const navProductsLink = document.getElementById('nav-products-link');
  const navCartLink = document.getElementById('nav-cart-link');
  const navStatsLink = document.getElementById('nav-stats-link');
  const navDashboardLink = document.getElementById('nav-dashboard-link');

  // Auth events
  const navLogin = document.getElementById('nav-login');
  const navRegister = document.getElementById('nav-register');
  const navLogout = document.getElementById('nav-logout');

  // User menu events
  const navUserMenu = document.getElementById('nav-user-menu');
  const navUserDropdown = document.getElementById('nav-user-dropdown');
  const navProfile = document.getElementById('nav-profile');
  const navSettings = document.getElementById('nav-settings');

  // Mobile menu events
  const navMobileMenu = document.getElementById('nav-mobile-menu');
  const navMobilePanel = document.getElementById('nav-mobile-panel');

  // Navigation handlers
  if (navHome) navHome.addEventListener('click', () => router.navigate('/'));
  if (navBackBtn) navBackBtn.addEventListener('click', () => router.navigate(options.backUrl || '/'));
  if (navHomeLink) navHomeLink.addEventListener('click', (e) => { e.preventDefault(); router.navigate('/'); });
  if (navProductsLink) navProductsLink.addEventListener('click', (e) => { e.preventDefault(); router.navigate('/products'); });
  if (navCartLink) navCartLink.addEventListener('click', (e) => { e.preventDefault(); router.navigate('/cart'); });
  if (navStatsLink) navStatsLink.addEventListener('click', (e) => { e.preventDefault(); router.navigate('/statistics'); });
  if (navDashboardLink) navDashboardLink.addEventListener('click', (e) => { e.preventDefault(); router.navigate('/dashboard'); });

  // Auth handlers
  if (navLogin) navLogin.addEventListener('click', () => router.navigate('/login'));
  if (navRegister) navRegister.addEventListener('click', () => router.navigate('/register'));
  if (navLogout) {
    navLogout.addEventListener('click', () => {
      auth.logout();
      router.navigate('/');
    });
  }

  // User menu handlers
  if (navUserMenu && navUserDropdown) {
    navUserMenu.addEventListener('click', () => {
      navUserDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!navUserMenu.contains(e.target)) {
        navUserDropdown.classList.add('hidden');
      }
    });
  }

  if (navProfile) navProfile.addEventListener('click', (e) => { e.preventDefault(); /* TODO: Profile page */ });
  if (navSettings) navSettings.addEventListener('click', (e) => { e.preventDefault(); /* TODO: Settings page */ });

  // Mobile menu handlers
  if (navMobileMenu && navMobilePanel) {
    navMobileMenu.addEventListener('click', () => {
      navMobilePanel.classList.toggle('hidden');
    });
  }

  // Mobile navigation handlers
  const mobileLinks = [
    { id: 'nav-mobile-home', url: '/' },
    { id: 'nav-mobile-products', url: '/products' },
    { id: 'nav-mobile-cart', url: '/cart' },
    { id: 'nav-mobile-stats', url: '/statistics' },
    { id: 'nav-mobile-dashboard', url: '/dashboard' },
    { id: 'nav-mobile-login', url: '/login' },
    { id: 'nav-mobile-register', url: '/register' }
  ];

  mobileLinks.forEach(({ id, url }) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate(url);
      });
    }
  });

  const navMobileLogout = document.getElementById('nav-mobile-logout');
  if (navMobileLogout) {
    navMobileLogout.addEventListener('click', () => {
      auth.logout();
      router.navigate('/');
    });
  }

  // Update cart counter if cartService is provided
  if (cartService) {
    updateCartCounter(cartService.getSummary());
    cartService.addListener(updateCartCounter);
  }
}

/**
 * Update cart counter in navbar
 * @param {Object} cartSummary - Cart summary from cart service
 */
function updateCartCounter(cartSummary) {
  const cartCount = document.getElementById('nav-cart-count');
  if (cartCount) {
    cartCount.textContent = cartSummary.itemCount;
    if (cartSummary.itemCount > 0) {
      cartCount.classList.remove('hidden');
    } else {
      cartCount.classList.add('hidden');
    }
  }
}

/**
 * Add custom CSS for navbar active states
 */
export function addNavbarStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: #4f46e5;
      border-bottom: 2px solid #4f46e5;
    }
    
    .nav-link:hover::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #4f46e5;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    
    .nav-link:hover::after {
      transform: scaleX(1);
    }
  `;
  document.head.appendChild(style);
} 