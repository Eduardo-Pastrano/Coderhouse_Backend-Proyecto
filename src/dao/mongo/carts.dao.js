import mongoose from "mongoose";
import { io } from "../../app.js";
import { cartModel } from "../models/carts.model.js";
import { productModel } from "../models/products.model.js";
import { logger } from "../../utils/logger.js";

export default class CartsDao {
    constructor() {
        logger.info("Connected: DAO - Carts")
    }

    async getCarts() {
        let carts = await cartModel.find();
        return carts
    }

    async getCartById(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            return cart;
        } catch (error) {
            throw new Error('There was an unexpected error while trying to get the cart by id: ' + error);
        }
    }

    async addCarts() {
        let newCart = await cartModel.create({ products: [] });
        return newCart
    }

    async addProductToCart(cartId, productId) {
        const objectIdCartId = new mongoose.Types.ObjectId(cartId);
        const cart = await cartModel.findOne({ _id: objectIdCartId });

        if (cart) {

            const product = await productModel.findOne({ _id: productId });

            if (product && product.stock > 0) {
                const cartProduct = cart.products.find(product => product.id === productId);
                
                if (!cartProduct) {
                    cart.products.push({
                        id: productId,
                        title: product.title,
                        price: product.price,
                        quantity: 1,
                    });

                    product.stock -= 1;
                    await product.save();

                    io.emit('products', { status: 'update', payload: product });
                } else if (cartProduct.quantity < product.stock) {
                    cartProduct.quantity += 1;
                    product.stock -= 1;
                    await product.save();

                    io.emit('products', { status: 'update', payload: product });
                } else {
                    logger.warning("There is not enough stock to add more of this product to the cart at the moment.")
                }

                await cart.save();
            } else {
                logger.error("The product is out of stock or does not exist.")
            }
        } else {
            logger.fatal("Cart not found.")
        }
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await cartModel.findOne({ _id: cartId });
        if (cart) {
            const productIndex = cart.products.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await cart.save();
            } else {
                logger.error('Product not found in cart.')
            }
        } else {
            logger.fatal('Cart not found.')
        }
    }

    async emptyCart(cartId) {
        const cart = await cartModel.findOne({ _id: cartId });
        if (cart) {
            cart.products = [];
            await cart.save();
        } else {
            logger.fatal('Cart not found.')
        }
    }

    async updateCartProducts(cartId, products) {
        const cart = await cartModel.findOne({ _id: cartId });
        if (cart) {
            cart.products = products.map(product => ({ _id: product._id, quantity: product.quantity }));
            await cart.save();
        } else {
            logger.fatal('Cart not found.')
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await cartModel.findOne({ _id: cartId });
        if (cart) {
            const product = cart.products.find(product => product.id === productId);
            if (product) {
                product.quantity = quantity;
                await cart.save();
            } else {
                logger.error('Product not found in cart.')
            }
        } else {
            logger.fatal("Cart not found.")
        }
    }

    async deleteCart(cartId) {
        await cartModel.deleteOne({ _id: cartId });
    }
}

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