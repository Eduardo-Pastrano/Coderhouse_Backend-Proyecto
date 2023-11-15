document.addEventListener("DOMContentLoaded", function () {
    const deleteButton = document.querySelectorAll(".del-prod-btn");
    const checkoutButton = document.querySelectorAll(".checkout-btn");

    deleteButton.forEach(button => {
        button.addEventListener("click", async function () {
            const productId = button.getAttribute("data-prod-id");
            const cartId = button.getAttribute("data-cart-id");

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();

                if (response.ok) {
                    button.closest('.product-container').remove();
                } else {
                    console.error("Error deleting the product:", data.error);
                }
            } catch (error) {
                console.error("An unexpected error occurred:", error);
            }
        });
    });

    checkoutButton.forEach(button => {
        button.addEventListener('click', async function() {
            const cartId = button.getAttribute("data-user-cart");
            const user = button.getAttribute("data-user-email");

            try {
                const response = await fetch(`/api/carts/${user}/purchase/${cartId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.replace(`/purchase/${data.payload._id}`);
                } else {
                    console.error("Error when making the purchase:", data.message);
                }
            } catch (error) {
                console.error("An unexpected error occurred:", error);
            }
        });
    });
});