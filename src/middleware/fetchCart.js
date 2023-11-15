import { productModel } from "../dao/models/products.model.js";
import CartsRepository from "../repository/carts.repository.js";

const repository = new CartsRepository();

export async function fetchCart(req, res, next) {
    try {
        const cartId = req.session.user.cart;
        const cart = await repository.getCartById(cartId);
        if (!cart) return res.status(404).send({ status: 'error', error: 'Cart not found.' });

        const transformedProducts = await Promise.all(cart.products.map(async product => {
            const productDetails = await productModel.findById(product._id);
            return {
                id: product._id,
                title: productDetails.title,
                price: product.price,
                quantity: product.quantity,
                totalPrice: product.quantity * productDetails.price,
            };
        }));

        const products = await Promise.all(transformedProducts);
        const totalProducts = products.reduce((total, product) => total + product.quantity, 0);
        const cartTotal = products.reduce((total, product) => total + product.totalPrice, 0);
        
        req.products = products;
        req.total = totalProducts;
        req.price = cartTotal;
        next()
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message });
    }
}