import { Router } from "express";
import Carts from "../dao/dbManagers/carts.js";

const router = Router();
const cartManager = new Carts();

/* Ruta api/carts/ para obtener todos los carritos, o limitar la cantidad de los mismos si se desea*/
router.get('/', async (req, res) => {
    let getCarts = await cartManager.getCarts();
    let limit = req.query.limit;

    if (!limit) return res.send({ getCarts });

    let carts = getCarts.slice(0, limit);
    res.status(200).send({ status: 'Success', payload: carts });
});

/* Ruta api/carts/ para agregar un carrito con un arreglo de productos vacio*/
router.post('/', async (req, res) => {
    let carts = await cartManager.addCarts();
    res.status(200).send({ status: 'Success', payload: `Cart created succesfully: ${carts}` })
});

/* Ruta api/carts/:cartId para obtener los productos de un carrito especificado con id*/
router.get('/:cartId', async (req, res) => {
    let cartId = req.params.cartId;
    let getCarts = await cartManager.getCarts(cartId);
    if (!cartId) return res.status(400).send({ status: 'error', error: 'Cart not found.' });
    res.status(200).send({ status: 'Success', payload: getCarts[0] })
});

/* Ruta api/carts/:cartId para eliminar los productos de un carrito especificado con id*/
router.delete('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        await cartManager.emptyCart(cartId)
        res.status(200).send({ status: 'Success', payload: `Products succesfully removed from cart: ${cartId}.` })
    } catch (error) {
        res.status(400).send({ status: 'error', error: `An error occurred while removing the products from the cart: ${cartId}.` })
    }
});

/* Ruta api/carts/:cartId para actualizar los productos de un carrito especificado con id*/
router.put('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    const { products } = req.body;
    try {
        await cartManager.updateCartProducts(cartId, products);
        res.status(200).send({ status: 'Success', payload: 'Cart updated succesfully.' });
    } catch (error) {
        res.status(400).send({ status: 'error', error: `An error occurred while updating the cart: ${cartId}` })
    }
});

/* Ruta api/carts/:cartId para actualizar solo la cantidad de un producto en un carrito especificado con id*/
router.put("/:cartId/products/:productId", async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    try {
        await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.status(200).send({ status: 'Success', payload: `Product in cart: ${cartId}, updated succesfully.` });
    } catch (error) {
        res.status(400).send({ status: 'error', error: `An error occurred while updating the product: ${productId} in cart: ${cartId}.` })
    }
})

/* Ruta api/carts/:cartId/products/:productId para agregar un producto de la collections products al carrito especificado con id*/
router.post("/:cartId/products/:productId", async (req, res) => {
    const { cartId, productId } = req.params;
    try {
        await cartManager.addProductToCart(cartId, productId);
        res.status(200).send({ status: 'Success', payload: `Product successfully added to cart: ${cartId}.` })
    } catch (error) {
        res.status(400).send({ status: 'error', error: `An error occurred while adding the product to cart: ${cartId}` })
    }
});

/* Ruta api/carts/:cartId/products/:productId para eliminar un producto del carrito especificado con id*/
router.delete('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    try {
        await cartManager.deleteProductFromCart(cartId, productId);
        res.status(200).send({ status: 'Success', payload: `Product succesfully removed from cart: ${cartId}.` })
    } catch (error) {
        res.status(400).send({ status: 'error', error: `An error occurred while removing the product from the cart: ${cartId}` })
    }
});

export default router;