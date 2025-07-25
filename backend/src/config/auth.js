import jwt from "jsonwebtoken";
import { randomBytes, createHmac } from "crypto";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

export const generateAuthResponseWithJwt = (user, res) => {
  const token = jwt.sign(
    { userId: user.id, email: user.email, pseudo: user.pseudo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.cookie("auth_token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const { password: userPassword, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const generateCsrfToken = (secret) => {
  const token = randomBytes(32).toString("hex");
  const signature = createHmac("sha256", secret).update(token).digest("hex");
  return `${token}:${signature}`;
};

export const verifyCsrfToken = (tokenWithSig, secret) => {
  const [token, signature] = tokenWithSig.split(":");
  const expectedSig = createHmac("sha256", secret).update(token).digest("hex");
  return signature === expectedSig;
};

export const csrfMiddleware = (req, res, next) => {
  //   const csrf = req.headers['x-csrf-token'];
  const csrf = req.cookies["csrf_token"]; //

  if (!csrf) {
    return res.status(403).json({ message: "CSRF token manquant" });
  }

  const isValid = verifyCsrfToken(csrf, process.env.CSRF_SECRET);

  if (!isValid) {
    return res.status(403).json({ message: "CSRF token invalide" });
  }

  next();
};

export const clearCsrfToken = (req, res, next) => {
  const csrf = req.cookies["csrf_token"];

  if (!csrf) {
    return res.status(403).json({ message: "CSRF token invalide" });
  }

  res.clearCookie("csrf_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
};
