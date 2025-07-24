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

export const  generateAuthResponseWithJwt = (user, res) => {
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
    return userWithoutPassword;
}