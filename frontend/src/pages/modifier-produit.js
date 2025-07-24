import { renderHeader, logoutHeaderEvents } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
// import {
//   redirectIfNotAuthenticated,
//   getToken,
//   headers,
// } from "../utils/auth.js";

// redirectIfNotAuthenticated();

const header = document.getElementById("header");
const footer = document.getElementById("footer");
header.innerHTML = renderHeader();
logoutHeaderEvents();
footer.innerHTML = renderFooter();

const loadProduct = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const res = await fetch(`http://localhost:3000/api/products/${productId}`, {
    // headers: headers(),
  });
  if (!res.ok) throw new Error("Erreur chargement produit");
  return await res.json();
};

const initForm = ({ libelle, description, prix, category_name, image_url }) => {
  form.libelle.value = libelle;
  form.description.value = description;
  form.prix.value = prix;
  form.categorie.value = category_name;

  existingImages = [...image_url];

  image_url.forEach((url) => {
    const remove = () => imagesToRemove.push(url);
    const preview = createPreview(
      `http://localhost:3000/images/${url}`,
      remove
    );
    existingImagesContainer.appendChild(preview);
  });
};

const createOption = ({ id, name }) =>
  `<option value="${name}">${name}</option>`;

// Chargement des catégories
const loadCategories = async () => {
  try {
    // const response = await fetch("/src/data/categorie.json");

    const response = await fetch("http://localhost:3000/api/categories");
    if (!response.ok) throw new Error("Erreur de chargement");

    const categories = await response.json();
    console.log(categories);
    const select = document.querySelector("select[name='categorie']");
    select.innerHTML =
      `<option value="">-- Sélectionner --</option>` +
      categories.map(createOption).join("");
  } catch (err) {
    alert("Impossible de charger les catégories");
    console.error(err);
  }
};

// Appel api pour récupérer les données (produit +  catégories)
(async () => {
  try {
    await loadCategories();
    const product = await loadProduct();
    initForm(product);
  } catch (err) {
    console.error(err);
    alert("Erreur de chargement");
  }
})();

const form = document.getElementById("editProductForm");
const imageInput = form.querySelector("input[name='images']");
const selectCategorie = form.querySelector("select[name='categorie']");
const existingImagesContainer = document.getElementById(
  "existingImagesContainer"
);
const newImagePreview = document.getElementById("newImagePreview");

let existingImages = []; // URLs d'images existantes
let imagesToRemove = []; // URLs à supprimer
let newImages = []; // Fichiers ajoutés

const createPreview = (src, onDelete) => {
  const container = document.createElement("div");
  container.className = "relative w-24 h-24 border rounded overflow-hidden";
  container.innerHTML = `
    <img src="${src}" class="w-full h-full object-cover" />
    <button type="button" class="absolute top-0 right-0 bg-red-600 text-white text-sm font-bold px-1 rounded-bl">&times;</button>
  `;
  container.querySelector("button").addEventListener("click", () => {
    onDelete();
    container.remove();
  });
  return container;
};

const readAsDataURL = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });

imageInput.addEventListener("change", async () => {
  const files = Array.from(imageInput.files);
  if (
    existingImages.length -
      imagesToRemove.length +
      newImages.length +
      files.length >
    3
  ) {
    alert("3 images max en tout (anciennes + nouvelles)");
    return (imageInput.value = "");
  }

  for (const file of files) {
    const src = await readAsDataURL(file);
    const remove = () => (newImages = newImages.filter((f) => f !== file));
    const preview = createPreview(src, remove);
    newImagePreview.appendChild(preview);
    newImages.push(file);
  }

  imageInput.value = "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const formData = new FormData();
  formData.append("libelle", form.libelle.value);
  formData.append("description", form.description.value);
  formData.append("prix", form.prix.value);
  formData.append("category_name", form.categorie.value);
  formData.append("imagesToRemove", JSON.stringify(imagesToRemove));
  newImages.forEach((img) => formData.append("newImages", img));

  try {
    const res = await fetch(`http://localhost:3000/api/products/${productId}`, {
      method: "PUT",
      // headers: headers(),
      body: formData,
      credentials: "include",
    });
    if (!res.ok) throw new Error("Erreur lors de la modification");
    alert("Produit modifié avec succès");
    window.location.href = "/dashboard.html";
  } catch (err) {
    console.error(err);
    alert("Échec de la modification");
  }
});
