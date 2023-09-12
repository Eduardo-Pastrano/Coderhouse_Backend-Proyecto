class CartsDto {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(product => ({
            id: product._id,
            quantity: product.quantity,
            price: product.price
        }));
    }
}

export default CartsDto;