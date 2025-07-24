/**
 * Dashboard page component
 * Main dashboard for authenticated users
 */

import { auth } from '../utils/auth.js';
import { router } from '../utils/router.js';
import { createNavbar, initializeNavbar, addNavbarStyles } from '../components/navbar.js';
import { showProductFormModal } from '../components/product-form-modal.js';

/**
 * Create and render the dashboard page
 */
export function createDashboardPage() {
  const app = document.getElementById('app');
  const currentUser = auth.getCurrentUser();

  // Redirect to login if not authenticated
  if (!currentUser) {
    router.navigate('/login');
    return;
  }

  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      ${createNavbar({ 
        currentPage: 'dashboard', 
        pageTitle: 'Tableau de Bord' 
      })}
      
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Welcome Section -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Bienvenue ${currentUser.firstName || currentUser.pseudo} !
            </h1>
            <p class="text-xl text-gray-600 mb-6">
              Votre tableau de bord de gestion des produits
            </p>
            <div class="flex items-center justify-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-sm text-gray-600">Connecté</span>
              </div>
              <div class="text-sm text-gray-500">
                ${new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Products Card -->
          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer" onclick="router.navigate('/products')">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Catalogue</h3>
            <p class="text-gray-600 text-sm">Parcourir tous les produits</p>
          </div>

          <!-- Ajouter Produit Card -->
          <div class="group bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 shadow-xl border border-indigo-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col items-center justify-center" id="add-product-btn">
            <div class="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-indigo-700 mb-2">Ajouter un produit</h3>
            <p class="text-gray-600 text-sm">Créer un nouveau produit</p>
          </div>

          <!-- Cart Card -->
          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer" onclick="router.navigate('/cart')">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2L4 3H2m5 10v6a1 1 0 001 1h10a1 1 0 001-1v-6m-5-7v3"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Mon Panier</h3>
            <p class="text-gray-600 text-sm">Voir mes articles</p>
          </div>

          <!-- Statistics Card -->
          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer" onclick="router.navigate('/statistics')">
            <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Statistiques</h3>
            <p class="text-gray-600 text-sm">Analyser les données</p>
          </div>

          <!-- Account Card -->
          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer" onclick="showAccountInfo()">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Mon Compte</h3>
            <p class="text-gray-600 text-sm">Informations utilisateur</p>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Activité récente
          </h2>
          <div class="space-y-4">
            <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Connexion réussie</p>
                <p class="text-xs text-gray-500">Il y a quelques instants</p>
              </div>
            </div>
            <div class="text-center py-4">
              <p class="text-gray-500 text-sm">
                Plus de fonctionnalités à venir...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  // Initialize navbar
  addNavbarStyles();
  initializeNavbar();
  
  // Make router available globally for onclick handlers
  window.router = router;
  window.showAccountInfo = showAccountInfo;

  // Ajouter un produit (modal)
  setTimeout(() => {
    const addBtn = document.getElementById('add-product-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        showProductFormModal({ mode: 'add', onSuccess: () => window.location.reload() });
      });
    }
  }, 0);
}

/**
 * Show account information modal/alert
 */
function showAccountInfo() {
  const currentUser = auth.getCurrentUser();
  
  alert(`Informations de compte :\n\n` +
        `Email: ${currentUser.email || 'Non défini'}\n` +
        `Pseudo: ${currentUser.pseudo || 'Non défini'}\n` +
        `Nom: ${currentUser.firstName || 'Non défini'}\n` +
        `Connecté depuis: ${new Date().toLocaleTimeString('fr-FR')}`);
}
