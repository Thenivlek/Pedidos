import express from "express";
import controller from "../controllers/posts";
const router = express.Router();
// Configuração das rotas
router.post("/posts/user", controller.getAuth);
router.get("/posts/products", controller.getProducts);
router.get("/posts/:id", controller.getPost);
router.put("/posts/:id", controller.updatePost);
router.delete("/posts/:id", controller.deletePost);
router.post("/posts/product", controller.addProduct);

export = router;
