import { renderHeader, logoutHeaderEvents } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
// import { redirectIfNotAuthenticated, headers } from "../utils/auth.js";

// redirectIfNotAuthenticated();

document.getElementById("header").innerHTML = renderHeader();
logoutHeaderEvents();
document.getElementById("footer").innerHTML = renderFooter();

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

loadCategories();

const form = document.getElementById("addProductForm");
const imageInput = form.querySelector("input[name='images']");

// Création du conteneur d'aperçus
const previewContainer = document.createElement("div");
previewContainer.id = "previewContainer";
previewContainer.className = "flex gap-2 mt-2 flex-wrap";
imageInput.parentNode.appendChild(previewContainer);

let selectedImages = [];

const readFileAsDataURL = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });

const createPreviewElement = (src, onDelete) => {
  const preview = document.createElement("div");
  preview.className = "relative w-24 h-24 border rounded overflow-hidden";
  preview.innerHTML = `
    <img src="${src}" alt="Image" class="w-full h-full object-cover" />
    <button
      type="button"
      class="absolute top-0 right-0 bg-red-600 text-white text-sm font-bold px-1 rounded-bl"
      title="Supprimer cette image"
    >&times;</button>
  `;
  preview.querySelector("button").addEventListener("click", () => {
    onDelete();
    preview.remove();
  });
  return preview;
};

const isValidImageCount = (images) => images.length <= 3;

const removeImageFromList = (images, fileToRemove) =>
  images.filter((img) => img !== fileToRemove);

const buildFormData = ({
  libelle,
  description,
  prix,
  category_name,
  images,
}) => {
  const formData = new FormData();
  formData.append("libelle", libelle);
  formData.append("description", description);
  formData.append("prix", prix);
  formData.append("category_name", category_name);
  images.forEach((file) => formData.append("images", file));
  return formData;
};

imageInput.addEventListener("change", async () => {
  const newFiles = Array.from(imageInput.files);

  if (!isValidImageCount([...selectedImages, ...newFiles])) {
    alert("Vous ne pouvez ajouter que 3 images maximum.");
    imageInput.value = "";
    return;
  }

  for (const file of newFiles) {
    const dataUrl = await readFileAsDataURL(file);

    const removeImage = () => {
      selectedImages = removeImageFromList(selectedImages, file);
    };

    const preview = createPreviewElement(dataUrl, removeImage);
    previewContainer.appendChild(preview);
  }

  selectedImages = [...selectedImages, ...newFiles];
  imageInput.value = "";
});

// Soumission du formulaire
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formValues = {
    libelle: form.libelle.value,
    description: form.description.value,
    prix: form.prix.value,
    category_name: form.categorie.value,
    images: selectedImages,
  };

  if (!isValidImageCount(formValues.images)) {
    alert("Vous ne pouvez ajouter que 3 images maximum.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      body: buildFormData(formValues),
      // headers: headers(),
    });

    if (!response.ok) throw new Error("Erreur serveur");

    const result = await response.json();
    alert("Produit ajouté avec succès !");
    form.reset();
    previewContainer.innerHTML = "";
    selectedImages = [];
    window.location.href = "/dashboard.html";
  } catch (err) {
    console.error("Erreur :", err);
    alert("Erreur lors de l'ajout du produit.");
  }
});
