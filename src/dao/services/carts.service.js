import { cartModel } from "../models/carts.model.js";

export default class Carts {
    constructor() {
        console.log("Connected: MongoDB - Carts")
    }

    async getCarts() {
        let carts = await cartModel.find();
        return carts
    }

    async getCarts(cartId) {
        let query = cartId ? { _id: cartId } : {};
        let carts = await cartModel.find(query).populate('products._id');
        return carts;
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

    async deleteProductFromCart(cartId, productId) {
        const cart = await cartModel.findOne({ _id: cartId });
        if (cart) {
            const productIndex = cart.products.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await cart.save();
            } else {
                console.log('Product not found in cart.')
            }
        } else {
            console.log('Cart not found.')
        }
    }

    async emptyCart(cartId) {
        const cart = await cartModel.findOne({ _id: cartId });
        if (cart) {
            cart.products = [];
            await cart.save();
        } else {
            console.log('Cart not found.')
        }
    }

    async updateCartProducts(cartId, products) {
        const cart = await cartModel.findOne({ _id: cartId });
        if (cart) {
            cart.products = products.map(product => ({ _id: product._id, quantity: product.quantity }));
            await cart.save();
        } else {
            console.log('Cart not found.')
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
                console.log('Product not found in cart.')
            }
        } else {
            console.log("Cart not found.")
        }
    }
}