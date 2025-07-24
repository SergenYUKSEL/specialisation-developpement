import { Router } from "express";
import { UserController } from "./UserController.js";
import { CategoryController } from "./CategoryController.js";
import { ProductController } from "./ProductController.js";
import { upload } from "../config/uploadConfig.js";
import { authMiddleware } from "../config/auth.js";
import {StatisticsController} from "./StatisticsController.js";

const router = Router();

router.get("/users/me", UserController.me);
router.post("/users/login", UserController.login);
router.post("/users/register", UserController.register);
router.post("/users/logout", UserController.logout);

router.get("/products", ProductController.getAll);
router.get("/products/:id", ProductController.getOne);
router.post(
  "/products",
  authMiddleware,
  upload.array("images", 3),
  ProductController.create
);
router.put(
  "/products/:id",
  authMiddleware,
  upload.array("newImages", 3),
  ProductController.update
);
router.delete("/products/:id", authMiddleware, ProductController.delete);

router.get("/statistics/categories", StatisticsController.getCategoriesMetrics);

router.get("/categories", CategoryController.getAll);
router.get("/categories/:id", CategoryController.getOne);
router.post("/categories", authMiddleware, CategoryController.create);
router.put("/categories/:id", authMiddleware, CategoryController.update);
router.delete("/categories/:id", authMiddleware, CategoryController.delete);

export default router;
