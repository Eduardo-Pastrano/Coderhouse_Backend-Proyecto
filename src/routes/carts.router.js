import { Router } from "express";
import CartManager from "../services/CartManager.js";

const router = Router();
const manager = new CartManager();

router.get('/', async (req, res) => {
    let getCarts = await manager.getCarts();
    let limit = req.query.limit;

    if (!limit) return res.send({ getCarts });

    let carts = getCarts.slice(0, limit);
    res.send(carts);
});

router.post('/', async (req, res) => {
    let carts = await manager.addCart();
    res.send({ status: 'Ok', message: 'Cart created'})
});

router.get('/:cartId', async (req, res) => {
    let getCarts = await manager.getCarts();
    let cartId = req.params.cartId;

    let cart = getCarts.find(c => c.id.toString() === cartId);
    if (!cart) return res.status(400).send({status: 'error', error: 'Cart not found.' });
    res.send(cart);
});

router.post("/:cartId/product/:productId", async (req, res) => {
    let cartId = parseInt(req.params.cartId);
    let productId = parseInt(req.params.productId);
    const products = await manager.addProductToCart(cartId, productId);

    res.send({ status: 'Ok', message: `Product successfully added to cart with id: ${cartId}.`})
});

export default router;