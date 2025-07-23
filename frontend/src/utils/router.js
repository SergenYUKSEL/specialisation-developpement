/**
 * Simple Router for SPA navigation
 * Manages page routing and history for the product management application
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentPage = null;
    this.initialized = false;
    this.init();
  }

  /**
   * Initialize router with event listeners
   */
  init() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      if (this.initialized) {
        this.handleRoute(window.location.pathname);
      }
    });

    // Don't handle initial page load here - wait for routes to be registered
  }

  /**
   * Start the router after routes are registered
   */
  start() {
    this.initialized = true;
    // Handle initial page load
    this.handleRoute(window.location.pathname);
  }

  /**
   * Register a new route
   * @param {string} path - The URL path
   * @param {Function} handler - Function to call when route is accessed
   */
  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  /**
   * Navigate to a specific route
   * @param {string} path - The destination path
   * @param {boolean} addToHistory - Whether to add to browser history
   */
  navigate(path, addToHistory = true) {
    if (addToHistory) {
      window.history.pushState({}, '', path);
    }
    this.handleRoute(path);
  }

  /**
   * Handle route changes
   * @param {string} path - The current path
   */
  handleRoute(path) {
    // Normalize path (remove trailing slash except for root)
    const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
    
    // First, try exact match
    const exactHandler = this.routes.get(normalizedPath);
    
    if (exactHandler) {
      this.currentPage = normalizedPath;
      exactHandler();
      return;
    }

    // Then try dynamic routes with parameters
    const matchedRoute = this.findDynamicRoute(normalizedPath);
    
    if (matchedRoute) {
      this.currentPage = normalizedPath;
      matchedRoute.handler(matchedRoute.params);
      return;
    }

    // No route found
    // Check if we have a home route before redirecting
    const homeHandler = this.routes.get('/');
    if (homeHandler && normalizedPath !== '/') {
      // Only redirect to home if we're not already trying to load home
      this.navigate('/', false);
    } else {
      // If no home route or we're already at home, show error page
      console.warn('Route not found:', normalizedPath);
      this.currentPage = normalizedPath;
      this.showNotFoundPage();
    }
  }

  /**
   * Find matching dynamic route
   * @param {string} path - The path to match
   * @returns {object|null} Matched route with params or null
   */
  findDynamicRoute(path) {
    for (const [routePattern, handler] of this.routes) {
      // Check if route has parameters (contains :)
      if (routePattern.includes(':')) {
        const params = this.matchPathWithPattern(path, routePattern);
        if (params) {
          return { handler, params };
        }
      }
    }
    return null;
  }

  /**
   * Match path with pattern and extract parameters
   * @param {string} path - The actual path
   * @param {string} pattern - The route pattern with :param
   * @returns {object|null} Parameters object or null if no match
   */
  matchPathWithPattern(path, pattern) {
    const pathSegments = path.split('/').filter(s => s);
    const patternSegments = pattern.split('/').filter(s => s);

    if (pathSegments.length !== patternSegments.length) {
      return null;
    }

    const params = {};

    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const pathSegment = pathSegments[i];

      if (patternSegment.startsWith(':')) {
        // Parameter segment
        const paramName = patternSegment.slice(1);
        params[paramName] = decodeURIComponent(pathSegment);
      } else if (patternSegment !== pathSegment) {
        // Static segment doesn't match
        return null;
      }
    }

    return params;
  }

  /**
   * Show 404 page when route is not found
   */
  showNotFoundPage() {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <h1 class="text-6xl font-bold text-gray-900">404</h1>
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
              Page non trouvée
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              La page que vous recherchez n'existe pas.
            </p>
            <div class="mt-6">
              <button 
                onclick="window.location.href = '/'"
                class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Get current page
   * @returns {string} Current page path
   */
  getCurrentPage() {
    return this.currentPage;
  }
}

// Export singleton instance
export const router = new Router(); 