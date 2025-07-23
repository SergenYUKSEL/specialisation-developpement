import {AppDataSource} from "../index.js";
import {User} from "../Entities/User.js";

export class UserController {
    static async getAll(req, res) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const users = await userRepository.find();

            const usersWithoutPassword = users.map(({password, ...othersAttributes})=>othersAttributes)
            console.log(usersWithoutPassword);
            res.status(200).json(usersWithoutPassword);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
    static async getOne(req, res) {
        try {
            const { id } = req.params;
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: parseInt(id) });

            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            const { password, ...userWithoutPassword } = user;
            console.log(userWithoutPassword);
            res.status(200).json(userWithoutPassword);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
}