import { cartModel } from "../models/carts.js";
import { productModel } from "../models/products.js"

export default class Carts {
    constructor() {
        console.log("Connected: MongoDB - Carts")
    }

    async getCarts() {
        let carts = await cartModel.find();
        return carts
    }

    async addCarts(cart) {
        let newCart = await cartModel.create(cart);
        return newCart
    }

    async addProductToCart(cartId, productId) {
        let cart = await cartModel.findById(cartId);
        if (cart) {
            const product = await productModel.findById(productId);

            if (!product) {
                cart.products.push({ product: productId, quantity: 1 });
            } else {
                const existingProductIndex = cart.products.findIndex(
                    (p) => p.product.toString() === productId.toString()
                );
                if (existingProductIndex >= 0) {
                    cart.products[existingProductIndex].quantity += 1;
                } else {
                    cart.products.push({ product: productId, quantity: 1 });
                }
            }
            await cart.save();
        } else {
            console.log('Cart not found.');
        }
    }
}