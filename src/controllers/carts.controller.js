import { productModel } from "../dao/models/products.model.js";
import CartsRepository from "../repository/carts.repository.js";
const repository = new CartsRepository();

class CartsController {
    async getCarts(req, res) {
        try {
            let limit = req.query.limit;
            let carts = await repository.getCarts(limit);
            res.status(200).send({ status: 'Ok', payload: carts });
        } catch (error) {
            res.status(404).send({ status: 'error', error: 'Carts not found.' });
        }
    }

    async getCartById(req, res) {
        try {
            let cartId = req.params.cartId;
            let cart = await repository.getCartById(cartId);
            if (!cart) return res.status(404).send({ status: 'error', error: 'Cart not found.' });
            res.status(200).send(cart);
        } catch (error) {
            res.status(400).send({ status: 'error', error: error.message });
        }
    }

    async addCarts(req, res) {
        try {
            let cart = await repository.addCarts();
            res.status(200).send({ status: 'Success', payload: `Cart created succesfully.` })
        } catch (error) {
            res.status(400).send({ status: 'error', error: 'There was an error creating the product.' });
        }
    }

    async addProductToCart(req, res) {
        const { cartId, productId } = req.params;
        const userEmail = req.user.email;

        try {
            const product = await productModel.findOne({ _id: productId });

            if (!product) return res.status(404).send({ status: 'error', error: 'Product not found.' });

            if (product.owner === userEmail) return res.status(400).send({ status: 'error', error: 'You cannot add your own product to the cart.' });

            await repository.addProductToCart(cartId, productId);
            res.status(200).send({ status: 'Success', payload: `Product successfully added to cart: ${cartId}.` })
        } catch (error) {
            console.error(`An error occurred while adding the product to cart: ${cartId},`, error );
            res.status(500).send({ status: 'error', error: 'An unexpected error occurred while adding the product to cart.' });
        }
    }

    async deleteProductFromCart(req, res) {
        const { cartId, productId } = req.params;
        try {
            await repository.deleteProductFromCart(cartId, productId);
            res.status(200).send({ status: 'Success', payload: `Product succesfully removed from cart: ${cartId}.` })
        } catch (error) {
            res.status(400).send({ status: 'error', error: `An error occurred while removing the product from the cart: ${cartId}` })
        }
    }

    async emptyCart(req, res) {
        const { cartId } = req.params;
        try {
            await repository.emptyCart(cartId)
            res.status(200).send({ status: 'Success', payload: `Products succesfully removed from cart: ${cartId}.` })
        } catch (error) {
            res.status(400).send({ status: 'error', error: `An error occurred while removing the products from the cart: ${cartId}.` })
        }
    }

    async updateCartProducts(req, res) {
        const { cartId } = req.params;
        const { products } = req.body;
        try {
            await repository.updateCartProducts(cartId, products);
            res.status(200).send({ status: 'Success', payload: `Cart with id: ${cartId} updated succesfully.` });
        } catch (error) {
            res.status(400).send({ status: 'error', error: `An error occurred while updating the cart: ${cartId}` })
        }
    }

    async updateProductQuantity(req, res) {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
        try {
            await repository.updateProductQuantity(cartId, productId, quantity);
            res.status(200).send({ status: 'Success', payload: `Product in cart: ${cartId}, updated succesfully.` });
        } catch (error) {
            res.status(400).send({ status: 'error', error: `An error occurred while updating the product: ${productId} in cart: ${cartId}.` })
        }
    }

    async deleteCart(req, res) {
        const { cartId } = req.params;
        try {
            await repository.deleteCart(cartId);
            res.status(200).send({ status: 'Success', payload: `Cart: ${cartId}, deleted succesfully.` });
        } catch (error) {
            res.status(400).send({ status: 'error', error: `An error occurred while deleting the cart: ${cartId}.` })
        }
    }
}

export default new CartsController();

/* Documentation */

// getCarts para obtener todos los carritos, o limitar la cantidad de los mismos si se desea.
// getCartById para obtener los productos de un carrito especificado por id.
// addCarts para agregar un carrito con un arreglo de productos vacio.
// addProductToCart para agregar un producto de la collections products al carrito especificado por id.
// deleteProductFromCart para eliminar un producto del carrito especificado por id.
// emptyCart para eliminar los productos de un carrito especificado por id y dejarlo vacio.
// updateCartProducts para actualizar los productos de un carrito especificado por id.
// updateProductQuantity para actualizar solo la cantidad de un producto en un carrito especificado por id.
// deleteCart para eliminar un carrito por completo, especificado por id.

/* Documentation */