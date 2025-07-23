import { isAuthenticated, logout } from "../utils/auth.js";

export const renderHeader = () => {
  const isConnected = isAuthenticated();

  return `
    <header class="bg-blue-600 text-white p-4">
      <nav class="container mx-auto flex justify-between items-center">
        <a href="/index.html" class="font-bold text-lg">Mon App</a>
        <div>
          ${
            isConnected
              ? `
              <a href="/dashboard.html" class="mr-4">Dashboard</a>
              <a href="/ajouter-produit.html" class="mr-4">Ajouter un produit</a>
              <a href="#" id="logoutLink" class="hover:underline">Déconnexion</a>
            `
              : `
              <a href="/login.html" class="mr-4 hover:underline">Connexion</a>
              <a href="/register.html" class="hover:underline">Inscription</a>
            `
          }
        </div>
      </nav>
    </header>
  `;
};

export const logoutHeaderEvents = () => {
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
      window.location.href = "/login.html";
    });
  }
};
