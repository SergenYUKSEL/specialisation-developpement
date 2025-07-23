/**
 * Statistics page
 * Displays product statistics by category in JSON format as specified
 */

import { statsAPI } from '../services/products.js';
import { router } from '../utils/router.js';
import { auth } from '../utils/auth.js';

let statisticsData = null;

/**
 * Create and render the statistics page
 */
export function createStatisticsPage() {
  const app = document.getElementById('app');
  const currentUser = auth.getCurrentUser();
  
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <!-- Navigation Header -->
      <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-3">
              <button id="back-home" class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                ← Accueil
              </button>
              <div class="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">GP</span>
              </div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Statistiques Produits
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              ${currentUser ? `
                <span class="text-sm text-gray-700 font-medium">
                  ${currentUser.firstName}
                </span>
                <button id="products-btn" class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  Catalogue
                </button>
              ` : `
                <button id="login-link" class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  Se connecter
                </button>
              `}
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Page Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Statistiques par Catégorie
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Visualisation des données produits et catégories sous format JSON accessible publiquement
          </p>
        </div>

        <!-- Loading State -->
        <div id="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p class="text-gray-600">Chargement des statistiques...</p>
        </div>

        <!-- Statistics Content -->
        <div id="stats-content" class="hidden space-y-8">
          <!-- API Info Section -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-8">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">URL des Statistiques</h2>
                <p class="text-gray-600">Endpoint JSON accessible publiquement pour les intégrations externes</p>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-6 mb-6">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700">URL de l'API :</label>
                <button 
                  id="copy-url" 
                  class="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                  title="Copier l'URL"
                >
                  📋 Copier
                </button>
              </div>
              <div class="bg-white rounded-lg p-4 border border-gray-200 font-mono text-sm break-all">
                <span id="api-url" class="text-gray-800">
                  ${window.location.origin}/api/statistics/categories
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="bg-blue-50 p-4 rounded-lg">
                <div class="font-medium text-blue-900 mb-1">📡 Méthode</div>
                <div class="text-blue-700">GET</div>
              </div>
              <div class="bg-green-50 p-4 rounded-lg">
                <div class="font-medium text-green-900 mb-1">🔓 Accès</div>
                <div class="text-green-700">Public (sans restriction IP)</div>
              </div>
              <div class="bg-purple-50 p-4 rounded-lg">
                <div class="font-medium text-purple-900 mb-1">📝 Format</div>
                <div class="text-purple-700">JSON</div>
              </div>
            </div>
          </div>

          <!-- Visual Statistics -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                </svg>
              </div>
              Répartition par Catégorie
            </h3>
            
            <div id="visual-stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Visual stats will be inserted here -->
            </div>
          </div>

          <!-- JSON Data Display -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg">
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h3 class="text-2xl font-bold text-gray-900 flex items-center">
                  <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-white text-sm font-bold">{}</span>
                  </div>
                  Données JSON
                </h3>
                <div class="flex space-x-2">
                  <button 
                    id="copy-json" 
                    class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                  >
                    📋 Copier JSON
                  </button>
                  <button 
                    id="download-json" 
                    class="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                  >
                    ⬇️ Télécharger
                  </button>
                </div>
              </div>
            </div>
            
            <div class="p-6">
              <div class="bg-gray-900 rounded-xl p-6 overflow-x-auto">
                <pre id="json-display" class="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  <!-- JSON data will be inserted here -->
                </pre>
              </div>
            </div>
          </div>

          <!-- Usage Examples -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              Exemples d'Utilisation
            </h3>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- JavaScript Example -->
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">JavaScript / Fetch API</h4>
                <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre class="text-green-400 font-mono text-sm"><code>fetch('${window.location.origin}/api/statistics/categories')
  .then(response => response.json())
  .then(data => {
    console.log('Statistiques:', data);
    // Traitement des données
  });</code></pre>
                </div>
              </div>

              <!-- curl Example -->
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">cURL</h4>
                <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre class="text-green-400 font-mono text-sm"><code>curl -X GET \\
  "${window.location.origin}/api/statistics/categories" \\
  -H "Accept: application/json"</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div id="error-state" class="hidden text-center py-12">
          <div class="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h2>
          <p class="text-gray-600 mb-6">Impossible de charger les statistiques.</p>
          <button 
            onclick="window.location.reload()"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Réessayer
          </button>
        </div>
      </main>

      <!-- Toast Notifications -->
      <div id="toast-container" class="fixed bottom-4 right-4 z-50"></div>
    </div>
  `;

  // Initialize page functionality
  initializeStatisticsPage();
  loadStatistics();
}

/**
 * Initialize statistics page functionality
 */
function initializeStatisticsPage() {
  // Navigation
  const backHome = document.getElementById('back-home');
  const productsBtn = document.getElementById('products-btn');
  const loginLink = document.getElementById('login-link');

  if (backHome) {
    backHome.addEventListener('click', () => router.navigate('/'));
  }

  if (productsBtn) {
    productsBtn.addEventListener('click', () => router.navigate('/products'));
  }

  if (loginLink) {
    loginLink.addEventListener('click', () => router.navigate('/login'));
  }

  // Action buttons
  const copyUrlBtn = document.getElementById('copy-url');
  const copyJsonBtn = document.getElementById('copy-json');
  const downloadJsonBtn = document.getElementById('download-json');

  if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', copyApiUrl);
  }

  if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', copyJsonData);
  }

  if (downloadJsonBtn) {
    downloadJsonBtn.addEventListener('click', downloadJsonData);
  }
}

/**
 * Load statistics data
 */
async function loadStatistics() {
  const loading = document.getElementById('loading');
  const content = document.getElementById('stats-content');
  const errorState = document.getElementById('error-state');

  try {
    const response = await statsAPI.getCategoryStats();

    if (response.success) {
      statisticsData = response.data;
      
      // Hide loading, show content
      loading.classList.add('hidden');
      content.classList.remove('hidden');
      
      // Render statistics
      renderVisualStats(statisticsData);
      renderJsonData(statisticsData);
      
    } else {
      throw new Error(response.message);
    }

  } catch (error) {
    console.error('Error loading statistics:', error);
    
    // Show error state
    loading.classList.add('hidden');
    errorState.classList.remove('hidden');
  }
}

/**
 * Render visual statistics
 */
function renderVisualStats(data) {
  const container = document.getElementById('visual-stats');
  const totalProducts = data.reduce((sum, cat) => sum + cat.compte, 0);

  container.innerHTML = data.map(category => {
    const percentage = Math.round((category.compte / totalProducts) * 100);
    const colors = {
      'Électronique': 'from-blue-500 to-blue-600',
      'Sport': 'from-green-500 to-green-600', 
      'Ameublement': 'from-orange-500 to-orange-600',
      'Alimentation': 'from-red-500 to-red-600'
    };

    return `
      <div class="bg-white/60 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${colors[category.nom] || 'from-gray-500 to-gray-600'} rounded-full flex items-center justify-center">
            <span class="text-2xl font-bold text-white">${category.compte}</span>
          </div>
          <h4 class="font-semibold text-gray-900 mb-2">${category.nom}</h4>
          <div class="text-2xl font-bold text-gray-700 mb-1">${category.compte}</div>
          <div class="text-sm text-gray-500">${percentage}% du total</div>
          
          <!-- Progress Bar -->
          <div class="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div class="bg-gradient-to-r ${colors[category.nom] || 'from-gray-500 to-gray-600'} h-2 rounded-full transition-all duration-1000" style="width: ${percentage}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render JSON data display
 */
function renderJsonData(data) {
  const jsonDisplay = document.getElementById('json-display');
  
  // Format JSON with proper indentation and syntax highlighting
  const formattedJson = JSON.stringify(data, null, 2);
  
  // Simple syntax highlighting
  const highlighted = formattedJson
    .replace(/(".*?")\s*:/g, '<span class="text-blue-400">$1</span>:')
    .replace(/:\s*(".*?")/g, ': <span class="text-yellow-400">$1</span>')
    .replace(/:\s*(\d+)/g, ': <span class="text-purple-400">$1</span>')
    .replace(/[{}]/g, '<span class="text-gray-300">$&</span>')
    .replace(/[\[\]]/g, '<span class="text-gray-300">$&</span>');
  
  jsonDisplay.innerHTML = highlighted;
}

/**
 * Copy API URL to clipboard
 */
async function copyApiUrl() {
  const url = document.getElementById('api-url').textContent;
  
  try {
    await navigator.clipboard.writeText(url);
    showToast('URL copiée dans le presse-papiers', 'success');
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast('URL copiée dans le presse-papiers', 'success');
  }
}

/**
 * Copy JSON data to clipboard
 */
async function copyJsonData() {
  if (!statisticsData) return;
  
  const jsonString = JSON.stringify(statisticsData, null, 2);
  
  try {
    await navigator.clipboard.writeText(jsonString);
    showToast('Données JSON copiées', 'success');
  } catch (error) {
    const textArea = document.createElement('textarea');
    textArea.value = jsonString;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast('Données JSON copiées', 'success');
  }
}

/**
 * Download JSON data as file
 */
function downloadJsonData() {
  if (!statisticsData) return;
  
  const jsonString = JSON.stringify(statisticsData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `statistics-categories-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('Fichier JSON téléchargé', 'success');
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