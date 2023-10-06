import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";
import TicketsController from "../controllers/tickets.controller.js";
import { userOnly } from "../middleware/userOnly.js";
import { normalAndPremium } from "../middleware/normalAndPremium.js"

class cartsRouter {
    constructor() {
        this.carts = Router();
        this.carts.get('/', CartsController.getCarts);
        this.carts.post('/', CartsController.addCarts);
        this.carts.get('/:cartId', CartsController.getCartById);
        this.carts.delete('/:cartId', CartsController.deleteCart)
        this.carts.put('/:cartId', CartsController.updateCartProducts);
        this.carts.delete('/:cartId/empty', CartsController.emptyCart);
        this.carts.put("/:cartId/products/:productId", normalAndPremium, CartsController.updateProductQuantity);
        this.carts.post("/:cartId/products/:productId", normalAndPremium, CartsController.addProductToCart);
        this.carts.delete('/:cartId/products/:productId', normalAndPremium, CartsController.deleteProductFromCart);
        this.carts.post('/:cartId/purchase', TicketsController.createTicket);
    }
}

export default new cartsRouter().carts;

/* Documentation */

// Ruta get '/' para obtener todos los carritos, o limitar la cantidad de los mismos si se desea.
// Ruta post '/' para agregar un carrito con un arreglo de productos vacio.
// Ruta get '/:cartId' para obtener los productos de un carrito especificado por id.
// Ruta delete '/:cartId/empty' para eliminar los productos de un carrito especificado por id.
// Ruta delete '/:cartId' para eliminar un carrito por completo, especificado por id.
// Ruta put '/:cartId' para actualizar los productos de un carrito especificado por id.
// Ruta put '/:cartId/products/:productId' para actualizar solo la cantidad de un producto en un carrito especificado por id, solo un usuario puede hacerlo.
// Ruta post '/:cartId/products/:productId' para agregar un producto de la collections products al carrito especificado por id, solo un usuario puede hacerlo.
// Ruta delete '/:cartId/products/:productId' para eliminar un producto del carrito especificado por id solo un usuario puede hacerlo.
// Ruta post '/:cartId/purchase' para crear un ticket de compra en base a un carrito especificado por id por params, y un user especificado por id con req.body.

/* Documentation */