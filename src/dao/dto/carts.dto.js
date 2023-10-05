class CartsDto {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(product => ({
            id: product._id,
            title: product.title,
            price: product.price,
            quantity: product.quantity,
        }));
    }
}

export default CartsDto;