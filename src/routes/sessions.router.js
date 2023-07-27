import { Router } from "express";
import { userModel } from "../dao/models/users.models.js";

const sessions = Router();

// Ruta para realizar el registro de un usuario
sessions.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const userExists = await userModel.findOne({ email });
    if (userExists) return res.status(400).send({ status: 'Error', Error: 'There is a user already registered with that email.' });

    const user = { first_name, last_name, email, age, password };
    let result = await userModel.create(user);
    res.send({ status: 'Success', message: 'User registered successfully.' })
});

// Ruta para realizar el login de un usuario, si al hacer el login, ingresa con el email: adminCoder@coder.com y password: adminCod3r123, se le da un rol de admin, sino, es un user.
sessions.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let user;

    let role = 'user';
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        role = 'admin';
        user = { first_name: 'Coder', last_name: 'Admin', email, age: '20' }
    } else {
        user = await userModel.findOne({ email, password });
        if (!user) return res.status({ status: 'Error', Error: 'Invalid email and/or password.' })
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role
    }
    res.send({ status: 'Success', payload: req.session.user, message: 'User logged in successfully.' })
})

export default sessions;