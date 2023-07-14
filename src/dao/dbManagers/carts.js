import { cartModel } from "../models/carts.model.js";

export default class Carts {
    constructor() {
        console.log("Connected: MongoDB - Carts")
    }

    async getCarts() {
        let carts = await cartModel.find();
        return carts
    }

    async addCarts() {
        let newCart = await cartModel.create({ products: [] });
        return newCart
    }

    async addProductToCart(cartId, productId) {
        const cart = await cartModel.findOne({ _id: cartId });
        if (cart) {
            const product = cart.products.find(product => product.id === productId);
            if (!product) {
                cart.products.push({ id: productId, quantity: 1 });
            } else {
                product.quantity += 1;
            }
            await cart.save();
        } else {
            console.log("Cart not found.")
        }
    }
}