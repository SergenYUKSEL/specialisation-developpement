import {AppDataSource} from "../index.js";
import {Category} from "../Entities/Category.js";

export class CategoryController {
    static async getAll(req, res) {
        try {
            const categoryRepository = AppDataSource.getRepository(Category);
            const categories = await categoryRepository.find();

            console.log(categories);
            res.status(200).json(categories);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async getOne(req, res) {
        try {
            const { id } = req.params;
            const categoryRepository = AppDataSource.getRepository(Category);
            const category = await categoryRepository.findOne({where: { id: parseInt(id) }});

            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }

            console.log(category);
            res.status(200).json(category);
        } catch (error) {
            console.error('Erreur lors de la récupération de la catégorie:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async create(req, res) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'Le nom de la catégorie est requis' });
            }

            const categoryRepository = AppDataSource.getRepository(Category);

            const existingCategory = await categoryRepository.findOneBy({ name });
            if (existingCategory) {
                return res.status(400).json({ message: 'Cette catégorie existe déjà' });
            }

            const newCategory = categoryRepository.create({
                name,
                product_count: 0
            });

            const savedCategory = await categoryRepository.save(newCategory);

            res.status(201).json(savedCategory);
        } catch (error) {
            console.error('Erreur lors de la création de la catégorie:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const categoryRepository = AppDataSource.getRepository(Category);

            const category = await categoryRepository.findOneBy({ id: parseInt(id) });
            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }

            if (name && name !== category.name) {
                const existingCategory = await categoryRepository.findOneBy({ name });
                if (existingCategory && existingCategory.id !== category.id) {
                    return res.status(400).json({ message: 'Ce nom de catégorie existe déjà' });
                }
            }

            category.name = name || category.name;

            const updatedCategory = await categoryRepository.save(category);

            res.status(200).json(updatedCategory);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la catégorie:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const categoryRepository = AppDataSource.getRepository(Category);

            const category = await categoryRepository.findOne({
                where: { id: parseInt(id) },
                relations: ["products"]
            });

            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }

            await categoryRepository.remove(category);

            console.log(`Catégorie ${id} supprimée`);
            res.status(200).json({ message: 'Catégorie supprimée avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
}