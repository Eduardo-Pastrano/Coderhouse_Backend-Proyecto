import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import { allUsers } from "../middleware/allUsers.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { premiumOnly } from "../middleware/premiumOnly.js";

class productsRouter {
    constructor() {
        this.products = Router();
        this.products.get('/', allUsers, ProductsController.getProducts);
        this.products.get('/:productId', ProductsController.getProductById);
        this.products.post('/', ProductsController.addProduct);
        this.products.put('/:productId', ProductsController.updateProduct);
        this.products.delete('/:productId', ProductsController.deleteProduct);
        this.products.post('/mockingproducts', ProductsController.generateProducts);
    }
}

export default new productsRouter().products;

/* Documentation */

// Ruta get '/' para obtener todos los productos, o limitar la cantidad de los mismos si se desea.
// Ruta post '/' para agregar un producto, todos los usuarios registrados pueden hacerlo.
// Ruta get '/:productId' para obtener el producto especificado por id.
// Ruta put '/:productId' para actualizar el producto especificado por id, solo un admin puede hacerlo.
// Ruta delete '/:productId' para eliminar el producto especificado por id solo un admin puede hacerlo.

/* Documentation */