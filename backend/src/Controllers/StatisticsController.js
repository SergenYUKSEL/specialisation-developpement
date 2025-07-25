import {AppDataSource} from "../index.js";
import {Category} from "../Entities/Category.js";

export class StatisticsController {
    static async getCategoriesMetrics(req, res) {
        try {
            const categoryRepository = AppDataSource.getRepository(Category);
            const categories = await categoryRepository.find();

            const formattedCategories = categories.map(category => ({
                nom: category.name,
                compte: category.product_count
            }));

            console.log(formattedCategories);
            res.status(200).json(formattedCategories);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
}