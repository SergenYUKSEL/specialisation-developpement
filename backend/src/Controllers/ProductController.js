import { AppDataSource } from "../index.js";
import { Product } from "../Entities/Product.js";
import { Category } from "../Entities/Category.js";
import fs from "fs";
import path from "path";

export class ProductController {
  static async getAll(req, res) {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const products = await productRepository.find({
        relations: ["category"],
      });

      res.status(200).json(products);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async getOne(req, res) {
    try {
      const { id } = req.params;
      const productRepository = AppDataSource.getRepository(Product);
      const product = await productRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["category"],
      });

      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }

      // Correction du parsing image_url
      let images = [];
      if (product.image_url) {
        try {
          images = JSON.parse(product.image_url);
          if (!Array.isArray(images)) {
            images = [images];
          }
        } catch {
          images = [product.image_url];
        }
      }
      const produit = {
        ...product,
        image_url: images,
      };

      res.status(200).json(produit);
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async create(req, res) {
    try {
      const { libelle, description, prix, category_name } = req.body;

      const files = req.files;

      const imageFilenames = files.map((file) => file.filename);

      const productRepository = AppDataSource.getRepository(Product);
      const categoryRepository = AppDataSource.getRepository(Category);

      let category = null;
      if (category_name) {
        category = await categoryRepository.findOneBy({ name: category_name });
        if (!category) {
          return res.status(400).json({ message: "Catégorie non trouvée" });
        }
      }

      const newProduct = productRepository.create({
        libelle,
        description,
        prix,
        category_name,
        image_url: JSON.stringify(imageFilenames),
      });

      const savedProduct = await productRepository.save(newProduct);

      if (category) {
        category.product_count += 1;
        await categoryRepository.save(category);
      }

      console.log(savedProduct);
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error("Erreur lors de la création du produit:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { libelle, description, prix, category_name, imagesToRemove } =
        req.body;

      const productRepository = AppDataSource.getRepository(Product);
      const categoryRepository = AppDataSource.getRepository(Category);

      const product = await productRepository.findOneBy({ id: parseInt(id) });
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      
      product.libelle = libelle ?? product.libelle;
      product.description = description ?? product.description;
      product.prix = prix ?? product.prix;

      const oldCategoryName = product.category_name;
      let newCategory = null;

      if (category_name && category_name !== oldCategoryName) {
        newCategory = await categoryRepository.findOneBy({
          name: category_name,
        });
        if (!newCategory)
          return res.status(400).json({ message: "Catégorie non trouvée" });
        product.category_name = category_name;
      }

      // Suppression des anciennes images
      const existingImages = Array.isArray(product.image_url)
        ? product.image_url
        : JSON.parse(product.image_url || "[]");

      const imagesToDelete = JSON.parse(imagesToRemove || "[]");

      imagesToDelete.forEach((filename) => {
        const filepath = path.join("src/images", filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      });

      const updatedImages = [
        ...existingImages.filter((img) => !imagesToDelete.includes(img)),
        ...(req.files || []).map((file) => file.filename),
      ];

      product.image_url = JSON.stringify(updatedImages);

      const savedProduct = await productRepository.save(product);

      if (oldCategoryName && oldCategoryName !== product.category_name) {
        const oldCat = await categoryRepository.findOneBy({
          name: oldCategoryName,
        });
        if (oldCat && oldCat.product_count > 0) {
          oldCat.product_count--;
          await categoryRepository.save(oldCat);
        }

        if (newCategory) {
          newCategory.product_count++;
          await categoryRepository.save(newCategory);
        }
      }

      res.status(200).json(savedProduct);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const productRepository = AppDataSource.getRepository(Product);
      const categoryRepository = AppDataSource.getRepository(Category);

      const product = await productRepository.findOneBy({ id: parseInt(id) });
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }

      // Suppression des anciennes images
      let existingImages = [];
      
      if (product.image_url) {
        try {
          // Si c'est déjà un tableau
          if (Array.isArray(product.image_url)) {
            existingImages = product.image_url;
          } 
          // Si c'est une chaîne qui commence par 'http' ou 'https', c'est une URL directe
          else if (typeof product.image_url === 'string' && product.image_url.startsWith('http')) {
            // Ne pas supprimer les images externes (URLs complètes)
            existingImages = [];
            console.log(`Image externe détectée: ${product.image_url}, pas de suppression nécessaire`);
          }
          // Si c'est une chaîne JSON
          else if (typeof product.image_url === 'string') {
            try {
              const parsed = JSON.parse(product.image_url);
              existingImages = Array.isArray(parsed) ? parsed : [parsed];
            } catch (jsonError) {
              // Si ce n'est pas du JSON valide, traiter comme un nom de fichier simple
              existingImages = [product.image_url];
            }
          }
        } catch (error) {
          console.error('Erreur lors du parsing des images:', error);
          existingImages = [];
        }
      }

      // Supprimer seulement les fichiers locaux (pas les URLs complètes)
      existingImages.forEach((filename) => {
        if (filename && !filename.startsWith('http')) {
          const filepath = path.join("src/images", filename);
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            console.log(`Image supprimée: ${filepath}`);
          }
        }
      });

      const categoryName = product.category_name;

      await productRepository.remove(product);

      if (categoryName) {
        const category = await categoryRepository.findOneBy({
          name: categoryName,
        });
        if (category && category.product_count > 0) {
          category.product_count -= 1;
          await categoryRepository.save(category);
        }
      }

      console.log(`Produit ${id} supprimé`);
      res.status(200).json({ message: "Produit supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
}
