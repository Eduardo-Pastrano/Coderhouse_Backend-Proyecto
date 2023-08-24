import { productModel } from "../models/products.model.js"

export default class Products {
    constructor() {
        console.log("Connected: MongoDB - Products")
    }

    async getProducts() {
        let products = await productModel.find();
        return products
    }

    async addProduct(product) {
        const newProduct = await productModel.create(product);
        return newProduct;
    }

    async updateProducts(products) {
        await productModel.deleteMany({});
        await productModel.insertMany(products);
        return this.updateProducts
    }

    async deleteProduct(_id) {
        await productModel.deleteOne({ _id: _id });
    }
}