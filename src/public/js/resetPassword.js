const form = document.getElementById('resetPasswordForm');

form.addEventListener('submit', event => {
    event.preventDefault();

    const data = new FormData(form);
    const object = {};
    data.forEach((value, key) => object[key] = value);

    fetch('/api/sessions/resetpassword', {
        method: 'POST',
        body: JSON.stringify(object),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/login');
        } else if (result.status === 400) {
            console.log('Password reset failed: New password must be different from the old one.')
        } else {
            console.log('Password reset failed: Unknown error.');
        }
    }).catch(error => {
        console.log('Password reset failed: ', error);
    });
});