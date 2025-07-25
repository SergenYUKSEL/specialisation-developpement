import {AppDataSource} from "../index.js";
import {User} from "../Entities/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {generateAuthResponseWithJwt} from "../config/auth.js";

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

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            const userWithoutPassword = generateAuthResponseWithJwt(user, res);

            res.status(200).json({
                message: 'Connexion réussie',
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    static async register(req, res) {
        try {
            const { email, pseudo, password } = req.body;

            if (!email || !pseudo || !password) {
                return res.status(400).json({ message: 'Email, pseudo et mot de passe requis' });
            }

            const userRepository = AppDataSource.getRepository(User);

            const existingUser = await userRepository.findOne({
                where: [
                    { email: email },
                    { pseudo: pseudo }
                ]
            });

            if (existingUser) {
                return res.status(409).json({ message: 'Email ou pseudo déjà utilisé' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = userRepository.create({
                email,
                pseudo,
                password: hashedPassword
            });

            const savedUser = await userRepository.save(newUser);

            const userWithoutPassword = generateAuthResponseWithJwt(savedUser, res);

            res.status(201).json({
                message: 'Inscription réussie',
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
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

    static async logout(req, res) {
        try {
            res.clearCookie('auth_token', {
                httpOnly: true,
                sameSite: 'strict'
            });

            res.status(200).json({
                message: 'Déconnexion réussie'
            });

        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
}