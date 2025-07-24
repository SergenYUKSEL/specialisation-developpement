/**
 * Home page component
 * Welcome page and navigation hub for the product management application
 */

import { auth } from '../utils/auth.js';
import { router } from '../utils/router.js';

/**
 * Create and render the home page
 */
export function createHomePage() {
  const app = document.getElementById('app');
  const currentUser = auth.getCurrentUser();

  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <!-- Navigation Header -->
      <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">GP</span>
              </div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Gestion de Produits
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              ${currentUser ? `
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-medium">
                      ${currentUser.pseudo.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span class="text-sm text-gray-700 font-medium">
                    ${currentUser.pseudo}
                  </span>
                  <button id="logout-btn" class="text-sm text-red-600 hover:text-red-800 font-medium transition-colors">
                    Déconnexion
                  </button>
                </div>
              ` : `
                <div class="flex items-center space-x-3">
                  <button id="login-btn" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                    Connexion
                  </button>
                  <button id="register-btn" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                    S'inscrire
                  </button>
                </div>
              `}
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div class="text-center">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Gestion de Produits
            </h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Une application moderne et complète pour gérer efficacement vos produits, 
              catégories et analyser vos performances commerciales.
            </p>
            ${!currentUser ? `
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button id="cta-register" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl">
                  Commencer maintenant
                </button>
                <button id="cta-login" class="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-600 hover:text-white transition-all">
                  Se connecter
                </button>
              </div>
            ` : `
              <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-green-200">
                <div class="flex items-center justify-center mb-4">
                  <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  Bienvenue ${currentUser.pseudo} !
                </h3>
                <p class="text-gray-600">
                  Vous êtes connecté et pouvez accéder à toutes les fonctionnalités.
                </p>
              </div>
            `}
          </div>
        </div>
        
        <!-- Decorative elements -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div class="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16 bg-white/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Fonctionnalités principales</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Découvrez tous les outils dont vous avez besoin pour gérer efficacement votre catalogue de produits.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Feature Cards -->
            <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Catalogue de Produits</h3>
              <p class="text-gray-600 mb-6">Gérez facilement votre inventaire avec notre interface intuitive et moderne.</p>
              <button id="products-link" class="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center">
                Découvrir 
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>

            <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Recherche Avancée</h3>
              <p class="text-gray-600 mb-6">Trouvez instantanément vos produits grâce à nos filtres intelligents.</p>
              <button id="search-link" class="text-green-600 font-semibold hover:text-green-800 transition-colors flex items-center">
                Rechercher
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>

            <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2L4 3H2m5 10v6a1 1 0 001 1h10a1 1 0 001-1v-6m-5-7v3"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Panier Intelligent</h3>
              <p class="text-gray-600 mb-6">Une expérience d'achat fluide avec sauvegarde automatique.</p>
              <button id="cart-link" class="text-purple-600 font-semibold hover:text-purple-800 transition-colors flex items-center">
                Voir le panier
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>

            <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Analyses & Statistiques</h3>
              <p class="text-gray-600 mb-6">Tableaux de bord interactifs pour optimiser vos ventes.</p>
              <button id="stats-link" class="text-orange-600 font-semibold hover:text-orange-800 transition-colors flex items-center">
                Analyser
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>

            <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Gestion Avancée</h3>
              <p class="text-gray-600 mb-6">Outils professionnels pour optimiser votre workflow.</p>
              <button id="management-link" class="text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center">
                Paramétrer
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>

            ${!currentUser ? `
              <div class="group bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-xl border-2 border-indigo-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Créer un Compte</h3>
                <p class="text-gray-600 mb-6">Rejoignez-nous pour accéder à toutes les fonctionnalités premium.</p>
                <button id="register-link" class="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center">
                  S'inscrire maintenant
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Bottom Section -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        ${!currentUser ? `
          <div class="mt-12 bg-indigo-50 rounded-lg p-8">
            <div class="text-center">
              <h3 class="text-lg font-medium text-indigo-900">
                Profitez de toutes les fonctionnalités
              </h3>
              <p class="mt-2 text-sm text-indigo-700">
                Connectez-vous ou créez un compte pour accéder à l'ensemble des fonctionnalités de l'application.
              </p>
              <div class="mt-6 flex justify-center space-x-4">
                <button id="cta-login-bottom" class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                  Se connecter
                </button>
                <button id="cta-register-bottom" class="bg-white text-indigo-600 px-6 py-2 rounded-md border border-indigo-300 hover:bg-indigo-50">
                  Créer un compte
                </button>
              </div>
            </div>
          </div>
        ` : `
          <div class="mt-12 bg-green-50 rounded-lg p-8">
            <div class="text-center">
              <h3 class="text-lg font-medium text-green-900">
                Bienvenue ${currentUser.pseudo} !
              </h3>
              <p class="mt-2 text-sm text-green-700">
                Vous êtes connecté et pouvez profiter de toutes les fonctionnalités de l'application.
              </p>
            </div>
          </div>
        `}
      </main>
    </div>
  `;

  // Initialize navigation functionality
  initializeHomeNavigation();
}

/**
 * Initialize home page navigation
 */
function initializeHomeNavigation() {
  const currentUser = auth.getCurrentUser();

  // Navigation buttons
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // CTA buttons
  const ctaLogin = document.getElementById('cta-login');
  const ctaRegister = document.getElementById('cta-register');
  const ctaLoginBottom = document.getElementById('cta-login-bottom');
  const ctaRegisterBottom = document.getElementById('cta-register-bottom');
  const registerLink = document.getElementById('register-link');

  // Feature navigation buttons
  const productsLink = document.getElementById('products-link');
  const searchLink = document.getElementById('search-link');
  const cartLink = document.getElementById('cart-link');
  const statsLink = document.getElementById('stats-link');
  const managementLink = document.getElementById('management-link');

  // Login navigation
  if (loginBtn) {
    loginBtn.addEventListener('click', () => router.navigate('/login'));
  }

  if (ctaLogin) {
    ctaLogin.addEventListener('click', () => router.navigate('/login'));
  }

  if (ctaLoginBottom) {
    ctaLoginBottom.addEventListener('click', () => router.navigate('/login'));
  }

  // Register navigation
  if (registerBtn) {
    registerBtn.addEventListener('click', () => router.navigate('/register'));
  }

  if (ctaRegister) {
    ctaRegister.addEventListener('click', () => router.navigate('/register'));
  }

  if (ctaRegisterBottom) {
    ctaRegisterBottom.addEventListener('click', () => router.navigate('/register'));
  }

  if (registerLink) {
    registerLink.addEventListener('click', () => router.navigate('/register'));
  }

  // Feature navigation
  if (productsLink) {
    productsLink.addEventListener('click', () => router.navigate('/products'));
  }

  if (searchLink) {
    searchLink.addEventListener('click', () => router.navigate('/products'));
  }

  if (cartLink) {
    cartLink.addEventListener('click', () => router.navigate('/cart'));
  }

  if (statsLink) {
    statsLink.addEventListener('click', () => router.navigate('/statistics'));
  }

  if (managementLink) {
    managementLink.addEventListener('click', () => router.navigate('/products'));
  }

  // Logout functionality
  if (logoutBtn && currentUser) {
    logoutBtn.addEventListener('click', async () => {
      // Confirm logout
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        try {
          // Call logout API (if needed)
          // await authAPI.logout(token);

          // Clear user session
          auth.logout();

          // Refresh page to show logged out state
          router.navigate('/', false);

        } catch (error) {
          console.error('Logout error:', error);
          // Still logout locally even if API call fails
          auth.logout();
          router.navigate('/', false);
        }
      }
    });
  }
}