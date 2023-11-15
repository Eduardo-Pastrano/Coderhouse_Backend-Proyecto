import CartsDao from "../dao/mongo/carts.dao.js";
import CartsDto from "../dao/dto/carts.dto.js";
import ProductsDao from "../dao/mongo/products.dao.js";
import { logger } from "../utils/logger.js";

class CartsRepository {
    constructor() {
        this.dao = new CartsDao();
        logger.info("Connected: Repository - Carts")
    }

    async getCarts(limit) {
        const carts = await this.dao.getCarts();
        if (limit) {
            return carts.slice(0, limit).map(cart => new CartsDto(cart));
        } else {
            return carts.map(cart => new CartsDto(cart))
        }
    }

    async getCartById(cartId) {
        const carts = await this.dao.getCarts();
        return carts.find(c => c.id.toString() === cartId);
    }

    async addCarts() {
        const cart = await this.dao.addCarts();
        return new CartsDto(cart);
    }

    async addProductToCart(cartId, productId) {
        await this.dao.addProductToCart(cartId, productId);
    }

    async deleteProductFromCart(cartId, productId) {
        await this.dao.deleteProductFromCart(cartId,productId);
    }

    async emptyCart(cartId) {
        await this.dao.emptyCart(cartId);
    }

    async updateCartProducts(cartId, products) {
        await this.dao.updateCartProducts(cartId, products);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        await this.dao.updateProductQuantity(cartId, productId, quantity);
    }

    async deleteCart(cartId) {
        await this.dao.deleteCart(cartId);
    }
}

export default CartsRepository;

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