const socket = io();

/* Real time products, no lo hice con un formulario, sin embargo cuando agregamos o eliminamos productos mediante Postman, se actualiza en tiempo real. */
function updateProducts(products) {
    const productsContainer = document.getElementById('products-container');
    let productsHTML = '';

    products.forEach(product => {
        productsHTML += `
            <div class="product">
                <h2>${product.title}</h2>
                <p>Description: ${product.description}</p>
                <p>Price: $${product.price}</p>
                <p>Stock: ${product.stock}</p>
            </div>
        `;
    });
    productsContainer.innerHTML = productsHTML;
};

socket.on("products", products => {
    updateProducts(products);
});