import { Router } from "express";
import Carts from "../dao/dbManagers/carts.js";

const router = Router();
const cartManager = new Carts();

router.get('/', async (req, res) => {
    let getCarts = await cartManager.getCarts();
    let limit = req.query.limit;

    if (!limit) return res.send({ getCarts });

    let carts = getCarts.slice(0, limit);
    res.send({ status: "Ok", payload: carts});
});

router.post('/', async (req, res) => {
    let carts = await cartManager.addCart();
    res.send({ status: 'Ok', payload: carts})
});

router.get('/:cartId', async (req, res) => {
    let getCarts = await cartManager.getCarts();
    let cartId = req.params.cartId;

    let cart = getCarts.find(c => c.id.toString() === cartId);
    if (!cart) return res.status(400).send({status: 'error', error: 'Cart not found.' });
    res.send({ status: 'Ok', payload: cart});
});

router.post("/:cartId/product/:productId", async (req, res) => {
    let cartId = parseInt(req.params.cartId);
    let productId = parseInt(req.params.productId);
    const products = await cartManager.addProductToCart(cartId, productId);

    res.send({ status: 'Ok', payload: `Product successfully added to cart with id: ${cartId}.`})
});

export default router;