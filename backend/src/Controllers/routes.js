import { Router } from 'express';
import {UserController} from "./UserController.js";
import {CategoryController} from "./CategoryController.js";
import {ProductController} from "./ProductController.js";

const router = Router();


router.get('/users', UserController.getAll);
router.get('/users/:id', UserController.getOne);

router.get('/products', ProductController.getAll);
router.get('/products/:id', ProductController.getOne);
router.post('/products', ProductController.create);
router.put('/products/:id', ProductController.update);
router.delete('/products/:id', ProductController.delete);

router.get('/categories', CategoryController.getAll);
router.get('/categories/:id', CategoryController.getOne);
router.post('/categories', CategoryController.create);
router.put('/categories/:id', CategoryController.update);
router.delete('/categories/:id', CategoryController.delete);


export default router;