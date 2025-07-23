import { AppDataSource } from "../index.js";
import { Product } from "../Entities/Product.js";
import { Category } from "../Entities/Category.js";

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

      console.log(product);
      res.status(200).json(product);
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  static async create(req, res) {
    try {
      const { libelle, description, image_url, prix, category_name } = req.body;

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
        image_url,
        prix,
        category_name,
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
      const { libelle, description, image_url, prix, category_name } = req.body;

      const productRepository = AppDataSource.getRepository(Product);
      const categoryRepository = AppDataSource.getRepository(Category);

      const product = await productRepository.findOneBy({ id: parseInt(id) });
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }

      const oldCategoryName = product.category_name;

      let newCategory = null;
      if (category_name) {
        newCategory = await categoryRepository.findOneBy({
          name: category_name,
        });
        if (!newCategory) {
          return res.status(400).json({ message: "Catégorie non trouvée" });
        }
      }

      product.libelle = libelle || product.libelle;
      product.description = description || product.description;
      product.image_url = image_url || product.image_url;
      product.prix = prix || product.prix;
      product.category_name =
        category_name !== undefined ? category_name : product.category_name;

      const updatedProduct = await productRepository.save(product);

      if (oldCategoryName !== product.category_name) {
        if (oldCategoryName) {
          const oldCategory = await categoryRepository.findOneBy({
            name: oldCategoryName,
          });
          if (oldCategory && oldCategory.product_count > 0) {
            oldCategory.product_count -= 1;
            await categoryRepository.save(oldCategory);
          }
        }

        if (newCategory) {
          newCategory.product_count += 1;
          await categoryRepository.save(newCategory);
        }
      }

      res.status(200).json(updatedProduct);
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
