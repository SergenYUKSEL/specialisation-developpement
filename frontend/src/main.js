import { renderHeader, logoutHeaderEvents } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { auth } from "./utils/auth.js";
import { cartService } from "./services/cart.js";
import { router } from "./utils/router.js";
import { createHomePage } from "./pages/home.js";
import { createLoginPage } from "./pages/login.js";
import { createRegisterPage } from "./pages/register.js";
import { createProductsPage } from "./pages/products.js";
import { createCartPage } from "./pages/cart.js";
import { createStatisticsPage } from "./pages/statistics.js";
import { createProductDetailPage } from "./pages/product-detail.js";

const header = document.getElementById("header");
const footer = document.getElementById("footer");

/**
 * Initialize the application
 */
async function initApp() {
    // Initialize authentication system
    await auth.init();

    // Initialize cart service
    cartService.init();

    // Register routes
    router.addRoute('/', createHomePage);
    router.addRoute('/login', createLoginPage);
    router.addRoute('/register', createRegisterPage);
    router.addRoute('/products', createProductsPage);
    router.addRoute('/cart', createCartPage);
    router.addRoute('/statistics', createStatisticsPage);

    // Register dynamic route for product details
    router.addRoute('/product/:id', (params) => {
        const productId = params.id;
        createProductDetailPage(productId);
    });

    // Start the router after routes are registered
    router.start();

    // Listen for authentication state changes
    auth.addListener((user) => {
        // Refresh current page when auth state changes
        const currentPage = router.getCurrentPage();
        if (currentPage) {
            router.navigate(currentPage, false);
        }
    });

    console.log('Application de gestion de produits initialisée avec toutes les fonctionnalités');
}
  
  // Start the application
  initApp();
  

// header.innerHTML = renderHeader();
// logoutHeaderEvents();

// footer.innerHTML = renderFooter();
