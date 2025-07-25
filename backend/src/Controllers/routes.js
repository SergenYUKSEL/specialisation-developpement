import { Router } from "express";
import { UserController } from "./UserController.js";
import { CategoryController } from "./CategoryController.js";
import { ProductController } from "./ProductController.js";
import { upload } from "../config/uploadConfig.js";
import {
  authMiddleware,
  csrfMiddleware,
  generateCsrfToken,
} from "../config/auth.js";
import { StatisticsController } from "./StatisticsController.js";

const router = Router();

router.get("/users/me", UserController.me);
router.post("/users/login", UserController.login);
router.post("/users/register", UserController.register);
router.post("/users/logout", UserController.logout);

router.get("/products", ProductController.getAll);
router.get("/products/:id", ProductController.getOne);
router.post(
  "/products",
  csrfMiddleware,
  authMiddleware,
  upload.array("images", 3),
  ProductController.create,
);
router.put(
  "/products/:id",
  csrfMiddleware,
  authMiddleware,
  upload.array("newImages", 3),
  ProductController.update,
);
router.delete(
  "/products/:id",
  csrfMiddleware,
  authMiddleware,
  ProductController.delete,
);

router.get("/statistics/categories", StatisticsController.getCategoriesMetrics);

router.get("/categories", CategoryController.getAll);
router.get("/categories/:id", CategoryController.getOne);
router.post(
  "/categories",
  csrfMiddleware,
  authMiddleware,
  CategoryController.create,
);
router.put(
  "/categories/:id",
  csrfMiddleware,
  authMiddleware,
  CategoryController.update,
);
router.delete(
  "/categories/:id",
  csrfMiddleware,
  authMiddleware,
  CategoryController.delete,
);

// CSRF token
router.get("/csrf", authMiddleware, (req, res) => {
  const token = generateCsrfToken(process.env.CSRF_SECRET);

  res.cookie("csrf_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 30 * 60 * 1000, // ⏳ 30 minutes
  });

  // res.status(200).json({ csrfToken: token });
});

export default router;
