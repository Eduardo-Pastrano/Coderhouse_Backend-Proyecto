import Carts from "../services/carts.service.js";
const cartManager = new Carts();

class CartsController {
    async getCarts(req, res) {
        let getCarts = await cartManager.getCarts();
        let limit = req.query.limit;
    
        if (!limit) return res.send({ getCarts });
    
        let carts = getCarts.slice(0, limit);
        res.status(200).send({ status: 'Success', payload: carts });
    }

    async getCartById(req, res) {
        let cartId = req.params.cartId;
        let getCarts = await cartManager.getCarts(cartId);
        if (!cartId) return res.status(400).send({ status: 'error', error: 'Cart not found.' });
        res.status(200).send({ status: 'Success', payload: getCarts[0] })
    }

    async addCarts(req, res) {
        let carts = await cartManager.addCarts();
        res.status(200).send({ status: 'Success', payload: `Cart created succesfully: ${carts}` })
    }

    async addProductToCart(req, res) {
        const { cartId, productId } = req.params;
        try {
            await cartManager.addProductToCart(cartId, productId);
            res.status(200).send({ status: 'Success', payload: `Product successfully added to cart: ${cartId}.` })
        } catch (error) {
            res.status(400).send({ status: 'error', error: `An error occurred while adding the product to cart: ${cartId}` })
        }
    }

    async deleteProductFromCart(req, res) {
        const { cartId, productId } = req.params;
        try {
            await cartManager.deleteProductFromCart(cartId, productId);
            res.status(200).send({ status: 'Success', payload: `Product succesfully removed from cart: ${cartId}.` })
        } catch (error) {
            res.status(400).send({ status: 'error', error: `An error occurred while removing the product from the cart: ${cartId}` })
        }
    }

    async emptyCart(req, res) {
        const { cartId } = req.params;
        try {
            await cartManager.emptyCart(cartId)
            res.status(200).send({ status: 'Success', payload: `Products succesfully removed from cart: ${cartId}.` })
        } catch (error) {
            res.status(400).send({ status: 'error', error: `An error occurred while removing the products from the cart: ${cartId}.` })
        }
    }

    async updateCartProducts(req, res) {
        const { cartId } = req.params;
        const { products } = req.body;
        try {
            await cartManager.updateCartProducts(cartId, products);
            res.status(200).send({ status: 'Success', payload: 'Cart updated succesfully.' });
        } catch (error) {
            res.status(400).send({ status: 'error', error: `An error occurred while updating the cart: ${cartId}` })
        }
    }

    async updateProductQuantity(req, res) {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
        try {
            await cartManager.updateProductQuantity(cartId, productId, quantity);
            res.status(200).send({ status: 'Success', payload: `Product in cart: ${cartId}, updated succesfully.` });
        } catch (error) {
            res.status(400).send({ status: 'error', error: `An error occurred while updating the product: ${productId} in cart: ${cartId}.` })
        }
    }
}

export default new CartsController();