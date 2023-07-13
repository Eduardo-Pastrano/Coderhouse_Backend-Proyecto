import fs from 'fs'

const archivo = "./database/products.json"

export default class ProductManager {
    constructor() {
        this.products = [];
    }

    getProducts = async () => {
        if (fs.existsSync(archivo)) {
            const datos = await fs.promises.readFile(archivo, 'utf-8')
            console.log(datos);

            const products = JSON.parse(datos)
            return products
        } else {
            return []
        }
    }

    addProduct = async (product) => {
        const products = await this.getProducts();

        if (products.length === 0) {
            product.id = 1
        } else {
            product.id = products[products.length - 1].id + 1;
        }
        products.push(product)

        await fs.promises.writeFile(archivo, JSON.stringify(products, null, '\t'))
        return product
    }

    async updateProducts(products) {
        await fs.promises.writeFile(archivo, JSON.stringify(products, null, '\t'));
    }

    async deleteProduct(id) {
            if (fs.existsSync(archivo)) {
                const datos = await fs.promises.readFile(archivo, 'utf-8');
                if (datos) {
                    this.products = JSON.parse(datos);
                    const index = this.products.findIndex((product) => product.id === id);
                    if (index !== -1) {
                        this.products.splice(index, 1);
                        await fs.promises.writeFile(archivo, JSON.stringify(this.products, null, '\t'));
                        console.log("Se eliminó correctamente el producto.");
                    }
                } else {
                    console.log("No se encontró el producto.")
                }
            } else {
                console.log("Archivo no encontrado.")
            }
    }
}