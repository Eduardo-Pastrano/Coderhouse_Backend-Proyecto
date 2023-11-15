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
                    /* Se supone que deberia actualizar el stock en el DOM, pero se debe recargar la pagina, to-do. */
                    const productStock = button.closest('.product-container').querySelector('.stock');
                    productStock.textContent = `Stock: ${data.newStock}`;
                    /* Se supone que deberia actualizar el stock en el DOM, pero se debe recargar la pagina, to-do. */
                } else {
                    console.error("Error adding product to cart:", data.error);
                }
            } catch (error) {
                console.error("An unexpected error occurred:", error);
            }
        });
    });
});
