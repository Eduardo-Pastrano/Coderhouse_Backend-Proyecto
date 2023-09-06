import { productModel } from "../models/products.model.js"

export default class ProductsDao {
    constructor() {
        console.log("Connected: DAO - Products")
    }

    async getProducts() {
        let products = await productModel.find();
        return products
    }

    async addProduct(product) {
        const newProduct = await productModel.create(product);
        return newProduct;
    }

    async updateProduct(productId, updatedProduct) {
        const product = await productModel.findOneAndUpdate({ _id: productId }, updatedProduct, { new: true });
        return product;
    }

    async deleteProduct(_id) {
        await productModel.deleteOne({ _id: _id });
    }
}

/* Documentation */

// getProducts para obtener todos los productos, o limitar la cantidad de los mismos si se desea.
// addProduct para agregar un producto.
// updateProduct para actualizar el producto especificado por id.
// deleteProduct para eliminar el producto especificado por id.

/* Documentation */