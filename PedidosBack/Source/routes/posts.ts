import express from "express";
import controller from "../controllers/posts";
const router = express.Router();
// Configuração das rotas
router.post("/posts/user", controller.getAuth);
router.post("/posts/search", controller.getProduct);
router.post("/posts/order", controller.newOrder);
router.post("/posts/product", controller.addProduct);
router.get("/posts/products", controller.getProducts);
router.get("/posts/orders/:id", controller.getOrders);
router.put("/posts/:id", controller.updateProduct);
router.delete("/posts/:id", controller.deleteProduct);
router.delete("/posts/order/:id", controller.deleteOrder);

export = router;
