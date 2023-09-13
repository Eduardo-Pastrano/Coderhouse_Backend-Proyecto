import { productModel } from "../models/products.model.js"
import { faker } from "@faker-js/faker";


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

    async generateProducts() {
        try {
            for (let n = 0; n < 100; n++) {
                const newProduct = {
                    title: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    code: faker.string.uuid(),
                    price: faker.commerce.price(),
                    stock: faker.number.int({min: 0, max: 100}),
                    category: faker.commerce.product(),
                }
                await productModel.create(newProduct);
            }

            const products = await productModel.find();
            if(!products) throw new Error('There were no products created.')
            return products;
        } catch (error) {
            throw new Error('There was an unexpected error generating the products.')
        }
    }
}

/* Documentation */

// getProducts para obtener todos los productos, o limitar la cantidad de los mismos si se desea.
// addProduct para agregar un producto.
// updateProduct para actualizar el producto especificado por id.
// deleteProduct para eliminar el producto especificado por id.

/* Documentation */