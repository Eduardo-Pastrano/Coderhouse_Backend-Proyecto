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

/* Chat comunitario */
let user;
let chatBox = document.getElementById('chat-box')

Swal.fire({
    title: "Por favor, identificate.",
    input: "text",
    text: "Ingresa tu usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas un nombre de usuario para poder continuar!"
    },
    allowOutsideClick: false
}).then (result => {
    user = result.value
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

socket.on('messageLogs', data => {
    let log = document.getElementById('message-logs');
    let messages = "";
    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message}</br>`
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
/* Chat comunitario */