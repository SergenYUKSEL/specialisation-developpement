/**
 * Tests TDD pour la page d'accueil
 * Suit les principes FIRST (Fast, Independent, Repeatable, Self-validating, Timely)
 * Méthodologie: RED -> GREEN -> REFACTOR
 */

import { createHomePage } from '../../src/pages/home.js';

// Mock des dépendances
jest.mock('../../src/utils/auth.js', () => ({
  auth: {
    getCurrentUser: jest.fn(),
    logout: jest.fn()
  }
}));

jest.mock('../../src/utils/router.js', () => ({
  router: {
    navigate: jest.fn()
  }
}));

jest.mock('../../src/components/navbar.js', () => ({
  createNavbar: jest.fn(() => '<nav>Mock Navbar</nav>'),
  initializeNavbar: jest.fn(),
  addNavbarStyles: jest.fn()
}));

// Import mocked modules
import { auth } from '../../src/utils/auth.js';
import { router } from '../../src/utils/router.js';
import { createNavbar, initializeNavbar, addNavbarStyles } from '../../src/components/navbar.js';

describe('Home Page - TDD', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="app"></div>';
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Page rendering', () => {
    // TEST 1: RED - Test de rendu de base
    test('should render home page with basic structure', () => {
      // Arrange
      auth.getCurrentUser.mockReturnValue(null);

      // Act
      createHomePage();

      // Assert
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Gestion de Produits');
      expect(app.innerHTML).toContain('Fonctionnalités principales');
    });

    // TEST 2: RED - Test de rendu avec utilisateur connecté
    test('should render welcome message for logged in user', () => {
      // Arrange
      const mockUser = { pseudo: 'TestUser', email: 'test@example.com' };
      auth.getCurrentUser.mockReturnValue(mockUser);

      // Act
      createHomePage();

      // Assert
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Bienvenue TestUser');
      expect(app.innerHTML).toContain('Vous êtes connecté');
    });

    // TEST 3: RED - Test de rendu sans utilisateur connecté
    test('should render CTA buttons for anonymous user', () => {
      // Arrange
      auth.getCurrentUser.mockReturnValue(null);

      // Act
      createHomePage();

      // Assert
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Commencer maintenant');
      expect(app.innerHTML).toContain('Se connecter');
    });

    // TEST 4: RED - Test d'initialisation de la navbar
    test('should initialize navbar components', () => {
      // Arrange
      auth.getCurrentUser.mockReturnValue(null);

      // Act
      createHomePage();

      // Assert
      expect(createNavbar).toHaveBeenCalledWith({ currentPage: 'home' });
      expect(addNavbarStyles).toHaveBeenCalled();
      expect(initializeNavbar).toHaveBeenCalled();
    });
  });

  describe('Navigation functionality', () => {
    beforeEach(() => {
      auth.getCurrentUser.mockReturnValue(null);
      createHomePage();
    });

    // TEST 5: RED - Test de navigation vers login
    test('should navigate to login when CTA login is clicked', () => {
      // Arrange
      const ctaLoginBtn = document.getElementById('cta-login');

      // Act
      ctaLoginBtn.click();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith('/login');
    });

    // TEST 6: RED - Test de navigation vers register
    test('should navigate to register when CTA register is clicked', () => {
      // Arrange
      const ctaRegisterBtn = document.getElementById('cta-register');

      // Act
      ctaRegisterBtn.click();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith('/register');
    });

    // TEST 7: RED - Test de navigation vers produits
    test('should navigate to products when products link is clicked', () => {
      // Arrange
      const productsLink = document.getElementById('products-link');

      // Act
      productsLink.click();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith('/products');
    });

    // TEST 8: RED - Test de navigation vers panier
    test('should navigate to cart when cart link is clicked', () => {
      // Arrange
      const cartLink = document.getElementById('cart-link');

      // Act
      cartLink.click();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith('/cart');
    });

    // TEST 9: RED - Test de navigation vers statistiques
    test('should navigate to statistics when stats link is clicked', () => {
      // Arrange
      const statsLink = document.getElementById('stats-link');

      // Act
      statsLink.click();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith('/statistics');
    });
  });

  describe('User-specific content', () => {
    // TEST 10: RED - Test du contenu pour utilisateur connecté
    test('should show dashboard link for authenticated user', () => {
      // Arrange
      const mockUser = { pseudo: 'TestUser' };
      auth.getCurrentUser.mockReturnValue(mockUser);

      // Act
      createHomePage();

      // Assert
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Tableau de Bord');
      expect(app.innerHTML).toContain('dashboard');
    });

    // TEST 11: RED - Test du contenu pour utilisateur anonyme
    test('should show registration encouragement for anonymous user', () => {
      // Arrange
      auth.getCurrentUser.mockReturnValue(null);

      // Act
      createHomePage();

      // Assert
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Créer un Compte');
      expect(app.innerHTML).toContain('Profitez de toutes les fonctionnalités');
    });

    // TEST 12: RED - Test de navigation vers dashboard
    test('should navigate to dashboard when dashboard link is clicked', () => {
      // Arrange
      const mockUser = { pseudo: 'TestUser' };
      auth.getCurrentUser.mockReturnValue(mockUser);
      createHomePage();
      const dashboardLink = document.getElementById('dashboard-link');

      // Act
      dashboardLink.click();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Feature cards', () => {
    beforeEach(() => {
      auth.getCurrentUser.mockReturnValue(null);
      createHomePage();
    });

    // TEST 13: RED - Test de présence des cartes de fonctionnalités
    test('should display all feature cards', () => {
      // Assert
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('Catalogue de Produits');
      expect(app.innerHTML).toContain('Recherche Avancée');
      expect(app.innerHTML).toContain('Panier Intelligent');
      expect(app.innerHTML).toContain('Analyses &amp; Statistiques');
      expect(app.innerHTML).toContain('Gestion Avancée');
    });

    // TEST 14: RED - Test de navigation depuis les cartes
    test('should navigate from feature cards', () => {
      // Arrange
      const searchLink = document.getElementById('search-link');
      const managementLink = document.getElementById('management-link');

      // Act
      searchLink.click();
      managementLink.click();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith('/products');
      expect(router.navigate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Responsive behavior', () => {
    // TEST 15: RED - Test de structure responsive
    test('should have responsive CSS classes', () => {
      // Arrange
      auth.getCurrentUser.mockReturnValue(null);

      // Act
      createHomePage();

      // Assert
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
      expect(app.innerHTML).toContain('max-w-7xl mx-auto');
      expect(app.innerHTML).toContain('px-4 sm:px-6 lg:px-8');
    });
  });

  describe('Accessibility', () => {
    // TEST 16: RED - Test d'accessibilité des boutons
    test('should have accessible button elements', () => {
      // Arrange
      auth.getCurrentUser.mockReturnValue(null);

      // Act
      createHomePage();

      // Assert
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button.textContent.trim()).toBeTruthy();
      });
    });

    // TEST 17: RED - Test des alternatives textuelles
    test('should have proper alt text and semantic elements', () => {
      // Arrange
      auth.getCurrentUser.mockReturnValue(null);

      // Act
      createHomePage();

      // Assert
      const app = document.getElementById('app');
      expect(app.innerHTML).toContain('<main');
      expect(app.innerHTML).toContain('<section');
      expect(app.innerHTML).toContain('<h1');
      expect(app.innerHTML).toContain('<h2');
      expect(app.innerHTML).toContain('<h3');
    });
  });

  describe('Error handling', () => {
    // TEST 18: RED - Test de gestion d'erreur auth
    test('should handle auth errors gracefully', () => {
      // Arrange
      auth.getCurrentUser.mockImplementation(() => {
        throw new Error('Auth error');
      });

      // Act & Assert
      expect(() => createHomePage()).not.toThrow();
    });
  });
}); 