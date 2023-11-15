const form = document.getElementById('requestForm');

form.addEventListener('submit', event => {
    event.preventDefault();

    const data = new FormData(form);
    const object = {};

    data.forEach((value, key) => object[key] = value);
    fetch('/api/sessions/request-reset', {
        method: 'POST',
        body: JSON.stringify({ email: object['email'] }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/check-email');
        }
        return result.json();
    });
});

// document.addEventListener("DOMContentLoaded", function () {
//     const continueButton = document.querySelectorAll(".submit-btn");

//     continueButton.forEach(button => {
//         button.addEventListener("click", async function (event) {
//             event.preventDefault();
//             const userEmail = document.querySelector('input[name="email"').value;

//             try {
//                 const response = await fetch(`http://localhost:8080/api/sessions/reset/${userEmail}`, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 const data = await response.json();

//                 if (response.ok) {

//                 } else {
//                     console.error(`Error sending the reset link to: ${userEmail}`);
//                 }
//             } catch (error) {
//                 console.error("An unexpected error occurred:", data.error);
//             }
//         });
//     });
// });