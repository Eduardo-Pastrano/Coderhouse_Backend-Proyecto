document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const productId = button.getAttribute("data-product-id");
            const cartId = button.getAttribute("data-cart-id");

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();

                if (response.ok) {

                } else {
                    console.error("Error adding product to cart:", data.error);
                }
            } catch (error) {
                console.error("An unexpected error occurred:", error);
            }
        });
    });
});

const socket = io();

socket.on("products", products => {
    products.forEach(updatedProduct => {
        const productContainer = document.querySelector(`[data-product-id="${updatedProduct._id}"]`);
        if (productContainer) {
            const stockElement = productContainer.querySelector(".stock");
            stockElement.textContent = `Stock: ${updatedProduct.stock}`;
        }
    });
});
