import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.auth_token;

        if (!token) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide' });
    }
};