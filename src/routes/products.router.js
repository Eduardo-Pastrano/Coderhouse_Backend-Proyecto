import { Router } from "express";
import ProductManager from "../services/ProductManager.js";

const router = Router();
const manager = new ProductManager();

router.get('/', async (req, res) => {
    let getProducts = await manager.getProducts();
    let limit = req.query.limit;

    if (!limit) return res.send({ getProducts });

    let products = getProducts.slice(0, limit);
    res.send(products);
});

router.post('/', async (req, res) => {
    const product = req.body;
    let products = await manager.addProduct(product);

    if (!product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.status ||
        !product.stock ||
        !product.category) {
        return res.status(400).send({ status: 'error', error: 'Please, make sure all of the fileds are filled.' });
    }

    res.send({ status: 'Ok', message: 'Product created.' })
});

router.get('/:productId', async (req, res) => {
    let getProducts = await manager.getProducts();
    let productId = req.params.productId;

    let product = getProducts.find(p => p.id.toString() === productId);
    if (!product) return res.status(400).send({ status: 'error', error: 'Product not found.' });
    res.send(product);
});

router.put('/:productId', async (req, res) => {
    let getProducts = await manager.getProducts();
    let productId = req.params.productId;

    let productIndex = getProducts.findIndex(p => p.id.toString() === productId);
    if (productIndex === -1) return res.status(400).send({ status: 'error', error: 'Product not found.' });

    let updatedProduct = { ...getProducts[productIndex], ...req.body };
    getProducts[productIndex] = updatedProduct;

    await manager.updateProducts(getProducts);

    res.send(updatedProduct);
});

router.delete('/:productId', async (req, res) => {
    let getProducts = await manager.getProducts();
    let productId = parseInt(req.params.productId);
    let product = getProducts.find(p => p.id === productId);

    if (product) {
        manager.deleteProduct(productId)
        res.send({ status: 'Ok', message: 'Product deleted successfully.' })
    } else {
        res.status(400).send({ status: 'error', error: 'Product not found.' })
    }
});

export default router;