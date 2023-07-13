import fs from 'fs'

const archivo = "./database/carts.json"

export default class CartManager {
    constructor() {
        this.carts = [];
        this.productId = 0;
    }

    getCarts = async () => {
        if (fs.existsSync(archivo)) {
            const datos = await fs.promises.readFile(archivo, 'utf-8')
            console.log(datos)

            const carts = JSON.parse(datos)
            return carts
        } else {
            return []
        }
    }

    addCart = async (cart) => {
        const datos = await fs.promises.readFile(archivo, 'utf-8');
        const carts = JSON.parse(datos);

        let newCart = {
            id: carts.length + 1,
            product: []
        };

        carts.push(newCart)

        await fs.promises.writeFile(archivo, JSON.stringify(carts, null, `\t`))
        return cart
    };

    async addProductToCart(cartId, productId) {
        const datos = await fs.promises.readFile(archivo, 'utf-8');
        const carts = JSON.parse(datos);

        const cart = carts.find(cart => cart.id === cartId);
        if (cart) {
            const product = cart.product.find(product => product.id === productId);
            if (!product) {
                cart.product.push({ id: productId, quantity: 1 });
            } else {
                product.quantity += 1;
            }

            const updatedCartProduct = carts.findIndex(cart => cart.id === cartId);
            carts[updatedCartProduct] = cart;
            await fs.promises.writeFile(archivo, JSON.stringify(carts, null, `\t`))
        } else {
            console.log('Cart not found.')
        }
	};
}