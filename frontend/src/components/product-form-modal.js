// Composant modal réutilisable pour ajout/modification de produit
// Inspiré de ajouter-produit.js
import { categoriesAPI } from '../services/products.js';

let modalContainer = null;

const API_BASE_URL = "http://localhost:3000/api";

export function showProductFormModal({ mode = 'add', product = null, onSuccess = null } = {}) {
  // Empêcher plusieurs modals
  if (modalContainer) {
    closeModal();
  }

  // Créer l'overlay
  modalContainer = document.createElement('div');
  modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm';
  modalContainer.tabIndex = -1;
  modalContainer.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
      <button id="close-modal" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none" title="Fermer">&times;</button>
      <h2 class="text-2xl font-bold mb-6 text-center">
        ${mode === 'edit' ? 'Modifier le produit' : 'Ajouter un produit'}
      </h2>
      <form id="product-form" autocomplete="off" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Libellé <span class="text-red-500">*</span></label>
          <input type="text" name="libelle" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" value="${product?.libelle || ''}" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description <span class="text-red-500">*</span></label>
          <textarea name="description" required rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">${product?.description || ''}</textarea>
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Prix (€) <span class="text-red-500">*</span></label>
            <input type="number" name="prix" min="0" step="0.01" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" value="${product?.prix || ''}" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie <span class="text-red-500">*</span></label>
            <select name="categorie" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="">-- Sélectionner --</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Images (max 3)</label>
          <input type="file" name="images" accept="image/*" multiple class="w-full" ${mode === 'edit' ? '' : ''} />
          <div id="previewContainer" class="flex gap-2 mt-2 flex-wrap"></div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button type="button" id="cancel-modal" class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">Annuler</button>
          <button type="submit" class="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all">${mode === 'edit' ? 'Enregistrer' : 'Ajouter'}</button>
        </div>
      </form>
      <div id="modal-toast" class="fixed bottom-6 right-6 z-50"></div>
    </div>
  `;
  document.body.appendChild(modalContainer);
  document.body.style.overflow = 'hidden';

  // Focus accessibility
  setTimeout(() => {
    modalContainer.focus();
  }, 100);

  // Fermeture modal
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) closeModal();
  });
  modalContainer.querySelector('#close-modal').onclick = closeModal;
  modalContainer.querySelector('#cancel-modal').onclick = closeModal;
  document.addEventListener('keydown', escListener);

  // Remplir les catégories dynamiquement
  (async () => {
    const select = modalContainer.querySelector('select[name="categorie"]');
    try {
      const res = await categoriesAPI.getAllCategories();
      if (res.success) {
        select.innerHTML = '<option value="">-- Sélectionner --</option>' +
          res.data.map(cat => `<option value="${cat.name}" ${product?.category_name === cat.name ? 'selected' : ''}>${cat.name}</option>`).join('');
      }
    } catch (e) {
      select.innerHTML = '<option value="">Erreur chargement</option>';
    }
  })();

  // Gestion images (preview, suppression, max 3)
  let selectedImages = [];
  let existingImages = Array.isArray(product?.images) ? product.images : (product?.image_url || []);
  if (mode === 'edit' && existingImages && existingImages.length) {
    renderPreviews(existingImages, true);
  }
  const imageInput = modalContainer.querySelector('input[name="images"]');
  const previewContainer = modalContainer.querySelector('#previewContainer');

  imageInput.addEventListener('change', async () => {
    const newFiles = Array.from(imageInput.files);
    if ((selectedImages.length + newFiles.length + (existingImages?.length || 0)) > 3) {
      showToast('Vous ne pouvez ajouter que 3 images maximum.', 'error');
      imageInput.value = '';
      return;
    }
    for (const file of newFiles) {
      const dataUrl = await readFileAsDataURL(file);
      const removeImage = () => {
        selectedImages = selectedImages.filter(f => f !== file);
        preview.remove();
      };
      const preview = createPreviewElement(dataUrl, removeImage);
      previewContainer.appendChild(preview);
      selectedImages.push(file);
    }
    imageInput.value = '';
  });

  function renderPreviews(images, isExisting = false) {
    images.forEach((img, idx) => {
      const src = typeof img === 'string' ? `/images/${img}` : img;
      const removeImage = () => {
        if (isExisting) {
          existingImages = existingImages.filter((_, i) => i !== idx);
        }
        preview.remove();
      };
      const preview = createPreviewElement(src, removeImage, isExisting);
      previewContainer.appendChild(preview);
    });
  }

  function createPreviewElement(src, onDelete, isExisting = false) {
    const preview = document.createElement('div');
    preview.className = 'relative w-24 h-24 border rounded overflow-hidden';
    preview.innerHTML = `
      <img src="${src}" alt="Image" class="w-full h-full object-cover" />
      <button type="button" class="absolute top-0 right-0 bg-red-600 text-white text-sm font-bold px-1 rounded-bl" title="Supprimer cette image">&times;</button>
    `;
    preview.querySelector('button').addEventListener('click', onDelete);
    return preview;
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  // Soumission du formulaire
  modalContainer.querySelector('#product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formValues = {
      libelle: form.libelle.value.trim(),
      description: form.description.value.trim(),
      prix: form.prix.value,
      category_name: form.categorie.value,
      images: selectedImages,
      imagesToRemove: mode === 'edit' ? JSON.stringify(product?.image_url?.filter((img, idx) => !existingImages.includes(img))) : undefined
    };
    if (!formValues.libelle || !formValues.description || !formValues.prix || !formValues.category_name) {
      showToast('Tous les champs sont obligatoires.', 'error');
      return;
    }
    if ((selectedImages.length + (existingImages?.length || 0)) > 3) {
      showToast('Vous ne pouvez ajouter que 3 images maximum.', 'error');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('libelle', formValues.libelle);
      formData.append('description', formValues.description);
      formData.append('prix', formValues.prix);
      formData.append('category_name', formValues.category_name);
      if (mode === 'edit' && formValues.imagesToRemove) {
        formData.append('imagesToRemove', formValues.imagesToRemove);
      }
      selectedImages.forEach((file) => formData.append(mode === 'edit' ? 'newImages' : 'images', file));
      const url = mode === 'edit'
        ? `${API_BASE_URL}/products/${product.id}`
        : `${API_BASE_URL}/products`;
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Erreur serveur');
      showToast(`Produit ${mode === 'edit' ? 'modifié' : 'ajouté'} avec succès !`, 'success');
      setTimeout(() => {
        closeModal();
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err) {
      showToast('Erreur lors de la soumission du produit.', 'error');
    }
  });

  function showToast(message, type = 'success') {
    const container = modalContainer.querySelector('#modal-toast');
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg mb-2 transform translate-x-full transition-transform duration-300`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 300);
    }, 2500);
  }

  function closeModal() {
    if (modalContainer) {
      document.body.removeChild(modalContainer);
      document.body.style.overflow = '';
      modalContainer = null;
      document.removeEventListener('keydown', escListener);
    }
  }

  function escListener(e) {
    if (e.key === 'Escape') closeModal();
  }
} 