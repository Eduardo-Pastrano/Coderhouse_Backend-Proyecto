const socket = io();

/* Real time products, no lo hice con un formulario, sin embargo cuando agregamos o eliminamos productos mediante Postman, se actualiza en tiempo real. */
function updateProducts(products) {
    const productsContainer = document.getElementById('products-container');
    let productsHTML = '';

    products.forEach(product => {
        productsHTML += `
            <div class="product">
                <h2>${product.title}</h2>
                <p>Category: ${product.description}</p>
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

/* Community Chat */

let user;
let chatBox = document.getElementById('chat-box')

Swal.fire({
    title: "Bienvenido! Por favor, identificate",
    input: "text",
    text: "Ingresa tu email para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas un nombre de usuario para poder continuar!"
    },
    allowOutsideClick: false
}).then (result => {
    user = result.value
    socket.emit("user", { user, message: "acaba de unirse al chat." })
});

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', {
                user: user,
                message: chatBox.value
            });
            chatBox.value = "";
        }
    }
})

socket.on('messagesLogs', data => {
    let log = document.getElementById('message-logs');
    let messages = "";
    data.forEach(message => {
        messages = messages + `<p>${message.user}</p>
                                <p>${message.message}</p><br>`
    })
    log.innerHTML = messages;
})

socket.on('newUserConnected', data => {
    if (!user) return;
    
    Swal.fire({
        text: "Nuevo usuario conectado.",
        toast: true,
        position: 'top-right'
    })
})