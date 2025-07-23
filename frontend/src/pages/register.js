import { renderHeader, logoutHeaderEvents } from "../components/header.js";
import { renderFooter } from "../components/footer.js";

const app = document.getElementById("app");

app.innerHTML = `
  ${renderHeader()}
  <main class="p-4">
    <h1 class="text-2xl font-bold mb-4">Inscription</h1>
    <form class="space-y-4">
      <input type="text" placeholder="Nom d'utilisateur" class="border p-2 w-full" />
      <input type="email" placeholder="Email" class="border p-2 w-full" />
      <input type="password" placeholder="Mot de passe" class="border p-2 w-full" />
      <button class="bg-blue-600 text-white px-4 py-2 rounded">S'inscrire</button>
    </form>
  </main>
  ${renderFooter()}
`;

logoutHeaderEvents();
