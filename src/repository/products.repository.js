import ProductsDto from '../dao/dto/products.dto.js';
import ProductsDao from '../dao/mongo/products.dao.js';
import { logger } from "../utils/logger.js";

class ProductsRepository {
    constructor() {
        this.dao = new ProductsDao();
        logger.info("Connected: Repository - Products")
    }

    async getProducts(limit) {
        const products = await this.dao.getProducts();
        if (limit) {
            return products.slice(0, limit).map(product => new ProductsDto(product));
        } else {
            return products.map(product => new ProductsDto(product))
        }
    }

    async getProductById(productId) {
        const products = await this.dao.getProducts();
        return products.find(p => p.id.toString() === productId);
    }

    async addProduct(productDto) {
        const product = await this.dao.addProduct(productDto);
        return new ProductsDto(product);
    }

    async updateProduct(productId, updatedProductDto) {
        const updatedProduct = await this.dao.updateProduct(productId, updatedProductDto);
        return new ProductsDto(updatedProduct);
    }

    async deleteProduct(productId) {
        const products = await this.dao.getProducts();
        const product = products.find(p => p.id.toString() === productId);

        if (product) {
            await this.dao.deleteProduct(productId)
        } else {
            throw new Error('Product not found.')
        }
    }

    async generateProducts() {
        try {
            const products = await this.dao.generateProducts();
            return products
        } catch (error) {
            throw new Error('No products were generated.')
        }
    }
}

export default ProductsRepository;

/* Documentation */

// getProducts para obtener todos los productos, o limitar la cantidad de los mismos si se desea.
// getProductById para obtener el producto especificado por id.
// addProduct para agregar un producto.
// updateProduct para actualizar el producto especificado por id.
// deleteProduct para eliminar el producto especificado por id.

/* Documentation */