const form = document.getElementById('registerForm');

form.addEventListener('submit', event => {
    event.preventDefault();

    const data = new FormData(form);
    const object = {};
    data.forEach((value, key) => object[key] = value);
    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(object),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/login')
        }
        return result.json();
    })
})