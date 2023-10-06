import ProductsRepository from '../repository/products.repository.js';
import CustomError from '../repository/errors/customErrors.js';
import eErrors from '../repository/errors/eErrors.js';
import { addProductErrorInfo } from '../repository/errors/info.js';
import UsersDto from '../dao/dto/users.dto.js';

const repository = new ProductsRepository();

class ProductsController {
    async getProducts(req, res) {
        try {
            let limit = req.query.limit;
            let products = await repository.getProducts(limit);
            res.status(200).send({ status: 'Ok', payload: products });
        } catch (error) {
            res.status(404).send({ status: 'error', error: 'Products not found.' });
        }
    }

    async getProductById(req, res) {
        try {
            let productId = req.params.productId;
            let product = await repository.getProductById(productId);
            if (!product) return res.status(404).send({ status: 'error', error: 'Product not found.' });
            res.status(200).send(product);
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
            const userRole = req.session.user.role;
            let ownerEmail;
            if (userRole !== 'premium') {
                ownerEmail = 'admin';
            } else {
                ownerEmail = req.session.user.email;
            }

            const newProduct = await repository.addProduct({
                ...product,
                owner: ownerEmail
            });

            res.status(200).send({ status: 'Ok', message: 'Product created successfully.', product: newProduct })
        } catch (error) {
            res.status(400).send({ status: 'error', error: 'There was an error creating the product.' });
        }
    }

    async updateProduct(req, res) {
        try {
            let productId = req.params.productId;
            let updatedProduct = await repository.updateProduct(productId, req.body);
            res.status(200).send({ status: 'Ok', message: `Product with id: ${productId}, updated successfully.` });
        } catch (error) {
            res.status(400).send({ status: 'error', error: 'There was an error updating the product.' })
        }
    }
    
    async deleteProduct(req, res) {
        try {
            const productId = req.params.productId;
            const product = await repository.getProductById(productId);

            if (!product) return res.status(404).send({ status: 'error', error: 'Product not found.' });

            if (req.session.user) {
                const { role, email } = req.session.user;

                if (role === 'admin') {
                    await repository.deleteProduct(productId);
                    return res.status(200).send({ status: 'Ok', message: `Product with id: ${productId}, deleted successfully.` })
                }

                if (role === 'premium' && product.owner === email) {
                    await repository.deleteProduct(productId);
                    return res.status(200).send({ status: 'Ok', message: `Product with id: ${productId}, deleted successfully.` })
                }
            }
            return res.status(403).send({ status: 'error', message: "You don't have enough permissions to delete this product." });
        } catch (error) {
            res.status(400).send({ status: 'error', error: 'There was an error deleting the product.' });
        }
    }

    async generateProducts(req, res) {
        try {
            const products = await repository.generateProducts();
            res.status(200).send({ status: 'Ok', message: 'Products generated successfully.', payload: products });
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