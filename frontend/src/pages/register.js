/**
 * Registration page component
 * Handles user registration with comprehensive validation
 */

import { validation, auth } from '../utils/auth.js';
import { authAPI, handleApiError } from '../services/api.js';
import { router } from '../utils/router.js';
import { createNavbar, initializeNavbar, addNavbarStyles } from '../components/navbar.js';

/**
 * Create and render the registration page
 */
export function createRegisterPage() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      ${createNavbar({ 
        currentPage: 'register', 
        showBackButton: true, 
        backUrl: '/', 
        pageTitle: 'Inscription' 
      })}
      
      <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer votre compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <button id="link-to-login" class="font-medium text-indigo-600 hover:text-indigo-500 underline">
            connectez-vous à votre compte existant
          </button>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form id="register-form" class="space-y-6">
            <!-- First Name Field -->
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <div class="mt-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autocomplete="given-name"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre prénom"
                >
              </div>
              <div id="firstName-error" class="mt-1 text-sm text-red-600 hidden"></div>
            </div>

            <!-- Last Name Field -->
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <div class="mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autocomplete="family-name"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre nom"
                >
              </div>
              <div id="lastName-error" class="mt-1 text-sm text-red-600 hidden"></div>
            </div>

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
                  autocomplete="new-password"
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
              
              <!-- Password Strength Indicator -->
              <div class="mt-2">
                <div class="text-xs text-gray-500 mb-1">Force du mot de passe:</div>
                <div class="flex space-x-1">
                  <div id="strength-bar-1" class="h-1 w-1/4 bg-gray-200 rounded"></div>
                  <div id="strength-bar-2" class="h-1 w-1/4 bg-gray-200 rounded"></div>
                  <div id="strength-bar-3" class="h-1 w-1/4 bg-gray-200 rounded"></div>
                  <div id="strength-bar-4" class="h-1 w-1/4 bg-gray-200 rounded"></div>
                </div>
                <div id="password-requirements" class="mt-2 text-xs text-gray-500">
                  <ul class="list-disc list-inside space-y-1">
                    <li id="req-length" class="text-red-500">Au moins 8 caractères</li>
                    <li id="req-uppercase" class="text-red-500">Une lettre majuscule</li>
                    <li id="req-lowercase" class="text-red-500">Une lettre minuscule</li>
                    <li id="req-number" class="text-red-500">Un chiffre</li>
                    <li id="req-special" class="text-red-500">Un caractère spécial</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <div class="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirmez votre mot de passe"
                >
                <button
                  type="button"
                  id="toggle-confirm-password"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  <span class="material-icons text-gray-400">👁️</span>
                </button>
              </div>
              <div id="confirmPassword-error" class="mt-1 text-sm text-red-600 hidden"></div>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              >
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                J'accepte les
                <button type="button" class="text-indigo-600 hover:text-indigo-500 underline">
                  conditions d'utilisation
                </button>
                et la
                <button type="button" class="text-indigo-600 hover:text-indigo-500 underline">
                  politique de confidentialité
                </button>
              </label>
            </div>
            <div id="terms-error" class="mt-1 text-sm text-red-600 hidden"></div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                id="submit-button"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span id="submit-text">Créer mon compte</span>
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
        </div>
      </div>
      </div>
    </div>
  `;

  // Initialize navbar and form functionality
  addNavbarStyles();
  initializeNavbar();
  initializeRegisterForm();
}

/**
 * Initialize registration form functionality
 */
function initializeRegisterForm() {
  const form = document.getElementById('register-form');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const togglePasswordButton = document.getElementById('toggle-password');
  const toggleConfirmPasswordButton = document.getElementById('toggle-confirm-password');
  const linkToLogin = document.getElementById('link-to-login');

  // Toggle password visibility
  togglePasswordButton.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePasswordButton.textContent = type === 'password' ? '👁️' : '🙈';
  });

  toggleConfirmPasswordButton.addEventListener('click', () => {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    toggleConfirmPasswordButton.textContent = type === 'password' ? '👁️' : '🙈';
  });

  // Navigate to login page
  linkToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/login');
  });

  // Real-time validation
  document.getElementById('firstName').addEventListener('blur', () => validateName('firstName', 'prénom'));
  document.getElementById('lastName').addEventListener('blur', () => validateName('lastName', 'nom'));
  document.getElementById('email').addEventListener('blur', () => validateEmail());
  passwordInput.addEventListener('input', () => validatePassword());
  confirmPasswordInput.addEventListener('blur', () => validateConfirmPassword());

  // Form submission
  form.addEventListener('submit', handleRegisterSubmit);
}

/**
 * Validate name fields
 */
function validateName(fieldName, displayName) {
  const input = document.getElementById(fieldName);
  const name = validation.sanitizeInput(input.value);
  
  if (!name) {
    showFieldError(fieldName, `Le ${displayName} est requis`);
    return false;
  }
  
  if (name.length < 2) {
    showFieldError(fieldName, `Le ${displayName} doit contenir au moins 2 caractères`);
    return false;
  }
  
  if (name.length > 50) {
    showFieldError(fieldName, `Le ${displayName} ne peut pas dépasser 50 caractères`);
    return false;
  }
  
  clearFieldError(fieldName);
  return true;
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
 * Validate password field with strength indicator
 */
function validatePassword() {
  const passwordInput = document.getElementById('password');
  const password = passwordInput.value;
  
  if (!password) {
    showFieldError('password', 'Le mot de passe est requis');
    updatePasswordStrength(0);
    updatePasswordRequirements(password);
    return false;
  }
  
  const passwordValidation = validation.validatePassword(password);
  
  if (!passwordValidation.isValid) {
    showFieldError('password', passwordValidation.errors[0]);
    updatePasswordStrength(calculatePasswordStrength(password));
    updatePasswordRequirements(password);
    return false;
  }
  
  clearFieldError('password');
  updatePasswordStrength(4);
  updatePasswordRequirements(password);
  return true;
}

/**
 * Validate confirm password field
 */
function validateConfirmPassword() {
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  if (!confirmPassword) {
    showFieldError('confirmPassword', 'La confirmation du mot de passe est requise');
    return false;
  }
  
  if (password !== confirmPassword) {
    showFieldError('confirmPassword', 'Les mots de passe ne correspondent pas');
    return false;
  }
  
  clearFieldError('confirmPassword');
  return true;
}

/**
 * Calculate password strength (0-4)
 */
function calculatePasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
  
  return strength;
}

/**
 * Update password strength visual indicator
 */
function updatePasswordStrength(strength) {
  const colors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];
  
  for (let i = 1; i <= 4; i++) {
    const bar = document.getElementById(`strength-bar-${i}`);
    if (bar) {
      // Reset all classes
      bar.className = 'h-1 w-1/4 rounded bg-gray-200';
      
      // Apply color based on strength
      if (i <= strength) {
        bar.classList.remove('bg-gray-200');
        bar.classList.add(colors[strength] || 'bg-gray-200');
      }
    }
  }
}

/**
 * Update password requirements checklist
 */
function updatePasswordRequirements(password) {
  const requirements = [
    { id: 'req-length', test: password.length >= 8 },
    { id: 'req-uppercase', test: /[A-Z]/.test(password) },
    { id: 'req-lowercase', test: /[a-z]/.test(password) },
    { id: 'req-number', test: /\d/.test(password) },
    { id: 'req-special', test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
  ];
  
  requirements.forEach(req => {
    const element = document.getElementById(req.id);
    if (element) {
      if (req.test) {
        element.classList.remove('text-red-500');
        element.classList.add('text-green-500');
      } else {
        element.classList.remove('text-green-500');
        element.classList.add('text-red-500');
      }
    }
  });
}

/**
 * Handle registration form submission
 */
async function handleRegisterSubmit(e) {
  e.preventDefault();
  
  // Clear previous messages
  clearAllErrors();
  clearMessages();
  
  // Get form data
  const formData = new FormData(e.target);
  const userData = {
    firstName: validation.sanitizeInput(formData.get('firstName')),
    lastName: validation.sanitizeInput(formData.get('lastName')),
    email: validation.sanitizeInput(formData.get('email')),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    terms: formData.get('terms')
  };
  
  // Validate all inputs
  let isValid = true;
  
  if (!validateName('firstName', 'prénom')) isValid = false;
  if (!validateName('lastName', 'nom')) isValid = false;
  if (!validateEmail()) isValid = false;
  if (!validatePassword()) isValid = false;
  if (!validateConfirmPassword()) isValid = false;
  
  // Check terms acceptance
  if (!userData.terms) {
    showFieldError('terms', 'Vous devez accepter les conditions d\'utilisation');
    isValid = false;
  }
  
  if (!isValid) {
    return;
  }
  
  // Show loading state
  setLoadingState(true);
  
  try {
    // Call API
    const response = await authAPI.register(userData);
    
    if (response.success) {
      // Save user data
      auth.setUser(response.data.user);
      
      // Show success message
      showSuccessMessage(`${response.message} Redirection en cours...`);
      
      // Redirect to home page after short delay
      setTimeout(() => {
        router.navigate('/');
      }, 2000);
      
    } else {
      // Show error message
      showGeneralError(response.message);
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    const errorResponse = handleApiError(error);
    showGeneralError(errorResponse.message);
    
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
  
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
  }
  
  if (inputElement && inputElement.type !== 'checkbox') {
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
  
  if (errorElement) {
    errorElement.classList.add('hidden');
  }
  
  if (inputElement && inputElement.type !== 'checkbox') {
    inputElement.classList.remove('border-red-300', 'focus:border-red-500', 'focus:ring-red-500');
    inputElement.classList.add('border-gray-300', 'focus:border-indigo-500', 'focus:ring-indigo-500');
  }
}

/**
 * Clear all field errors
 */
function clearAllErrors() {
  ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'terms'].forEach(fieldName => {
    clearFieldError(fieldName);
  });
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
      submitText.textContent = 'Création du compte...';
      loadingSpinner.classList.remove('hidden');
    } else {
      submitText.textContent = 'Créer mon compte';
      loadingSpinner.classList.add('hidden');
    }
  }
} 