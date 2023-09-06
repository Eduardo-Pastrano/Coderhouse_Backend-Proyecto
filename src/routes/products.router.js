import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";

class productsRouter {
    constructor() {
        this.products = Router();
        this.products.get('/', ProductsController.getProducts);
        this.products.get('/:productId', ProductsController.getProductById);
        this.products.post('/', ProductsController.addProduct);
        this.products.put('/:productId', ProductsController.updateProduct);
        this.products.delete('/:productId', ProductsController.deleteProduct);
    }
}

export default new productsRouter().products;

/* Documentation */

// Ruta get '/' para obtener todos los productos, o limitar la cantidad de los mismos si se desea.
// Ruta post '/' para agregar un producto.
// Ruta get '/:productId' para obtener el producto especificado por id.
// Ruta put '/:productId' para actualizar el producto especificado por id.
// Ruta delete '/:productId' para eliminar el producto especificado por id.

/* Documentation */