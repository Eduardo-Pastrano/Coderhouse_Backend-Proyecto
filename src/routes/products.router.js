import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import { adminOnly } from "../middleware/adminOnly.js";

class productsRouter {
    constructor() {
        this.products = Router();
        this.products.get('/', ProductsController.getProducts);
        this.products.get('/:productId', ProductsController.getProductById);
        this.products.post('/', ProductsController.addProduct);
        this.products.put('/:productId', adminOnly, ProductsController.updateProduct);
        this.products.delete('/:productId', adminOnly, ProductsController.deleteProduct);
        this.products.post('/mockingproducts', adminOnly, ProductsController.generateProducts);
    }
}

export default new productsRouter().products;

/* Documentation */

// Ruta get '/' para obtener todos los productos, o limitar la cantidad de los mismos si se desea.
// Ruta post '/' para agregar un producto, solo un admin puede hacerlo.
// Ruta get '/:productId' para obtener el producto especificado por id.
// Ruta put '/:productId' para actualizar el producto especificado por id, solo un admin puede hacerlo.
// Ruta delete '/:productId' para eliminar el producto especificado por id solo un admin puede hacerlo.

/* Documentation */