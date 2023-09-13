import ProductsRepository from '../repository/products.repository.js';
import CustomError from '../repository/errors/customErrors.js';
import eErrors from '../repository/errors/eErrors.js';
import { addProductErrorInfo } from '../repository/errors/info.js';

const repository = new ProductsRepository();

class ProductsController {
    async getProducts(req, res) {
        try {
            let limit = req.query.limit;
            let products = await repository.getProducts(limit);
            res.send({ status: 'Ok', payload: products });
        } catch (error) {
            res.status(400).send({ status: 'error', error: 'Products not found.' });
        }
    }

    async getProductById(req, res) {
        try {
            let productId = req.params.productId;
            let product = await repository.getProductById(productId);
            if (!product) return res.status(400).send({ status: 'error', error: 'Product not found.' });
            res.send(product);
        } catch (error) {
            res.status(400).send({ status: 'error', error: error.message });
        }
    }

    async addProduct(req, res) {
        const product = req.body;
        if (!product.title ||
            !product.description ||
            !product.code ||
            !product.price ||
            !product.status ||
            !product.stock ||
            !product.category) {
            throw CustomError.createError({
                name: 'Product creation error.',
                cause: addProductErrorInfo(product),
                message: 'Error trying to create the product.',
                code: eErrors.INVALID_TYPES_ERROR
            });
        }
        try {
            await repository.addProduct(product);
            res.send({ status: 'Ok', message: 'Product created successfully.' })
        } catch (error) {
            res.status(400).send({ status: 'error', error: 'There was an error creating the product.' });
        }
    }

    async updateProduct(req, res) {
        try {
            let productId = req.params.productId;
            let updatedProduct = await repository.updateProduct(productId, req.body);
            res.send({ status: 'Ok', message: `Product with id: ${productId}, updated successfully.` });
        } catch (error) {
            res.status(400).send({ status: 'error', error: 'There was an error updating the product.' })
        }
    }

    async deleteProduct(req, res) {
        try {
            let productId = req.params.productId;
            await repository.deleteProduct(productId);
            res.send({ status: 'Ok', message: `Product with id: ${productId}, deleted successfully.` })
        } catch (error) {
            res.status(400).send({ status: 'error', error: 'There was an error deleting the product.' })
        }
    }

    async generateProducts(req, res) {
        try {
            const products = await repository.generateProducts();
            res.send({ status: 'Ok', message: 'Products generated successfully.', payload: products });
        } catch (error) {
            res.status(400).send({ status: 'error', error: 'There was an error generating the products.' });
        }
    }
}

export default new ProductsController();

/* Documentation */

// getProducts para obtener todos los productos, o limitar la cantidad de los mismos si se desea.
// getProductById para obtener el producto especificado por id.
// addProduct para agregar un producto.
// updateProduct para actualizar el producto especificado por id.
// deleteProduct para eliminar el producto especificado por id.

/* Documentation */