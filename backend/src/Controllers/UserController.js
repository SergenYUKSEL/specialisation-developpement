import {AppDataSource} from "../index.js";
import {User} from "../Entities/User.js";
import jwt from "jsonwebtoken";

export class UserController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email et mot de passe requis' });
            }

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ email: email });

            if (!user) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            if (user.password !== password) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email, pseudo: user.pseudo },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.cookie('auth_token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            const { password: userPassword, ...userWithoutPassword } = user;

            res.status(200).json({
                message: 'Connexion réussie',
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async me(req, res) {
        try {
            const token = req.cookies.auth_token;
            console.log(token);
            if (!token) {
                return res.status(401).json({ message: 'Non authentifié' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: decoded.userId });

            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }

            const { password, ...userWithoutPassword } = user;

            res.status(200).json({
                message: 'Utilisateur authentifié',
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Erreur lors de la vérification:', error);
            res.status(401).json({ message: 'Token invalide ou expiré' });
        }
    }
}