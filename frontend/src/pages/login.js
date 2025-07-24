/**
 * Login page component
 * Handles user authentication with validation and error handling
 */

import { validation, auth } from '../utils/auth.js';
import { authAPI, handleApiError } from '../services/api.js';
import { router } from '../utils/router.js';
import { createNavbar, initializeNavbar, addNavbarStyles } from '../components/navbar.js';

/**
 * Create and render the login page
 */
export function createLoginPage() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      ${createNavbar({ 
        currentPage: 'login', 
        showBackButton: true, 
        backUrl: '/', 
        pageTitle: 'Connexion' 
      })}
      
      <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion à votre compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <button id="link-to-register" class="font-medium text-indigo-600 hover:text-indigo-500 underline">
            créez un nouveau compte
          </button>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form id="login-form" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="votre@email.com"
                >
              </div>
              <div id="email-error" class="mt-1 text-sm text-red-600 hidden"></div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div class="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre mot de passe"
                >
                <button
                  type="button"
                  id="toggle-password"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  <span class="material-icons text-gray-400">👁️</span>
                </button>
              </div>
              <div id="password-error" class="mt-1 text-sm text-red-600 hidden"></div>
            </div>

            <!-- Remember me -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                >
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                id="submit-button"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span id="submit-text">Se connecter</span>
                <span id="loading-spinner" class="hidden ml-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </button>
            </div>

            <!-- General Error Message -->
            <div id="general-error" class="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 hidden"></div>

            <!-- Success Message -->
            <div id="success-message" class="mt-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3 hidden"></div>
          </form>

          <!-- Demo Credentials -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Compte de démonstration</span>
              </div>
            </div>
            <div class="mt-3 text-xs text-gray-500 bg-gray-50 rounded-md p-3">
              <strong>Email:</strong> admin@example.com<br>
              <strong>Mot de passe:</strong> Admin123!
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize navbar and form functionality
  addNavbarStyles();
  initializeNavbar();
  initializeLoginForm();
}

/**
 * Initialize login form functionality
 */
function initializeLoginForm() {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordButton = document.getElementById('toggle-password');
  const submitButton = document.getElementById('submit-button');
  const linkToRegister = document.getElementById('link-to-register');

  // Toggle password visibility
  togglePasswordButton.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePasswordButton.textContent = type === 'password' ? '👁️' : '🙈';
  });

  // Navigate to register page
  linkToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/register');
  });

  // Real-time validation
  emailInput.addEventListener('blur', () => validateEmail());
  passwordInput.addEventListener('input', () => clearFieldError('password'));

  // Form submission
  form.addEventListener('submit', handleLoginSubmit);
}

/**
 * Validate email field
 */
function validateEmail() {
  const emailInput = document.getElementById('email');
  const email = validation.sanitizeInput(emailInput.value);
  
  if (!email) {
    showFieldError('email', 'L\'adresse email est requise');
    return false;
  }
  
  if (!validation.isValidEmail(email)) {
    showFieldError('email', 'Veuillez entrer une adresse email valide');
    return false;
  }
  
  clearFieldError('email');
  return true;
}

/**
 * Handle login form submission
 */
async function handleLoginSubmit(e) {
  e.preventDefault();

  // Clear previous messages
  clearAllErrors();
  clearMessages();

  // Get form data
  const formData = new FormData(e.target);
  const email = validation.sanitizeInput(formData.get('email'));
  const password = formData.get('password');

  // Validate inputs
  let isValid = true;

  if (!validateEmail()) {
    isValid = false;
  }

  if (!password) {
    showFieldError('password', 'Le mot de passe est requis');
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Show loading state
  setLoadingState(true);

  try {
    const response = await authAPI.login(email, password);

    if (response.success) {
      // Save user data
      auth.setUser(response.data.user);

      // Show success message
      showSuccessMessage(response.message);

      // Redirect to home page after short delay
      setTimeout(() => {
        router.navigate('/');
      }, 1000);

    } else {
      // Show error message
      showGeneralError(response.message);
    }

  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = handleApiError(error);
    showGeneralError(errorMessage);

  } finally {
    setLoadingState(false);
  }
}

/**
 * Show field-specific error
 */
function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const inputElement = document.getElementById(fieldName);
  
  if (errorElement && inputElement) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    inputElement.classList.add('border-red-300', 'focus:border-red-500', 'focus:ring-red-500');
    inputElement.classList.remove('border-gray-300', 'focus:border-indigo-500', 'focus:ring-indigo-500');
  }
}

/**
 * Clear field-specific error
 */
function clearFieldError(fieldName) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const inputElement = document.getElementById(fieldName);
  
  if (errorElement && inputElement) {
    errorElement.classList.add('hidden');
    inputElement.classList.remove('border-red-300', 'focus:border-red-500', 'focus:ring-red-500');
    inputElement.classList.add('border-gray-300', 'focus:border-indigo-500', 'focus:ring-indigo-500');
  }
}

/**
 * Clear all field errors
 */
function clearAllErrors() {
  ['email', 'password'].forEach(fieldName => clearFieldError(fieldName));
}

/**
 * Show general error message
 */
function showGeneralError(message) {
  const errorElement = document.getElementById('general-error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
  }
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
  const successElement = document.getElementById('success-message');
  if (successElement) {
    successElement.textContent = message;
    successElement.classList.remove('hidden');
  }
}

/**
 * Clear all messages
 */
function clearMessages() {
  const generalError = document.getElementById('general-error');
  const successMessage = document.getElementById('success-message');
  
  if (generalError) generalError.classList.add('hidden');
  if (successMessage) successMessage.classList.add('hidden');
}

/**
 * Set loading state
 */
function setLoadingState(isLoading) {
  const submitButton = document.getElementById('submit-button');
  const submitText = document.getElementById('submit-text');
  const loadingSpinner = document.getElementById('loading-spinner');
  
  if (submitButton && submitText && loadingSpinner) {
    submitButton.disabled = isLoading;
    
    if (isLoading) {
      submitText.textContent = 'Connexion...';
      loadingSpinner.classList.remove('hidden');
    } else {
      submitText.textContent = 'Se connecter';
      loadingSpinner.classList.add('hidden');
    }
  }
} 