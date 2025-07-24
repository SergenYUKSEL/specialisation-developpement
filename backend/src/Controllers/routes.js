import { Router } from "express";
import { UserController } from "./UserController.js";
import { CategoryController } from "./CategoryController.js";
import { ProductController } from "./ProductController.js";
import { upload } from "../config/uploadConfig.js";
import {authMiddleware} from "../config/auth.js";

const router = Router();

router.get("/users/me", UserController.me);
router.post("/users/login", UserController.login);

router.get("/products", ProductController.getAll);
router.get("/products/:id", ProductController.getOne);
router.post("/products",authMiddleware, upload.array("images", 3), ProductController.create);
router.put(
  "/products/:id",
    authMiddleware,
  upload.array("newImages", 3),
  ProductController.update
);
router.delete("/products/:id", authMiddleware, ProductController.delete);

router.get("/categories", CategoryController.getAll);
router.get("/categories/:id", CategoryController.getOne);
router.post("/categories", CategoryController.create);
router.put("/categories/:id", CategoryController.update);
router.delete("/categories/:id", CategoryController.delete);

export default router;