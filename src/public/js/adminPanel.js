document.addEventListener("DOMContentLoaded", function () {
    const deleteButton = document.querySelectorAll(".delete-user-btn");
    const changeRoleButton = document.querySelectorAll(".role-user-btn");

    deleteButton.forEach(button => {
        button.addEventListener("click", async function () {
            const userEmail = button.getAttribute("data-delete-user");

            try {
                const response = await fetch(`/api/sessions/delete/${userEmail}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();

                if (response.ok) {
                    button.closest('.user-container').remove();
                } else {
                    console.error("Error deleting the user:", data.error);
                }
            } catch (error) {
                console.error("An unexpected error occurred:", error);
            }
        });
    });

    changeRoleButton.forEach(button => {
        button.addEventListener('click', async function () {
            const userEmail = button.getAttribute("data-change-role");

            try {
                const response = await fetch(`/api/sessions/premium/${userEmail}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    const roleElement = button.closest('.user-container').querySelector('.role');
                    roleElement.textContent = `Role: ${data.newRole}`;
                    res.json({ message: `User role has been updated to: ${newRole}`, newRole: newRole });
                } else {
                    console.error("Error changing the user's role:", data.error);
                }
            } catch (error) {
                console.error("An unexpected error occurred:", error);
            }
        });
    });
});