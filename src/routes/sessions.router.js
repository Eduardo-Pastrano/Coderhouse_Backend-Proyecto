import { Router } from "express";
import { userModel } from "../dao/models/users.models.js";
import { createHash } from "../utils.js";
import passport from 'passport';

const sessions = Router();

// Ruta para realizar el registro de un usuario
sessions.post('/register', passport.authenticate('register', { failureRedirect: '/failedregister' }), async (req, res) => {
    res.send({ status: 'Success', message: 'User registered successfully.' })
});

sessions.get('/failedregister', async (req, res) => {
    console.log('Failed register strategy.')
    res.send({ error: 'failed' })
});

// Ruta para realizar el login de un usuario, si al hacer el login, ingresa con el email: adminCoder@coder.com y password: adminCod3r123, se le da un rol de admin, sino, es un user.
sessions.post('/login', passport.authenticate('login', { failureRedirect: '/failedlogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 'Error', Error: 'Invalid email and/or password.' })

    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }

    res.send({ status: 'Success', payload: req.session.user, message: 'User logged in successfully.' });
});

sessions.get('/failedlogin', (req, res) => {
    res.send({ status: 'Error', Error: 'Failed login strategy.' })
});

/* Rutas necesarias para la estrategia de autenticacion o login con GitHub */
sessions.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => { });

sessions.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        role: 'user'
    };
    res.redirect('/');
});
/* Rutas necesarias para la estrategia de autenticacion o login con GitHub */

/* Ruta para realizar un password reset */
sessions.post('/resetpassword', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: 'Error', Error: 'Incomplete values.' });
    const user = await userModel.findOne({ email });

    if (!user) return res.status({ status: 'Error', Error: 'User not found' });
    const newPassword = createHash(password);
    await userModel.updateOne({ _id: user._id }, { $set: { password: newPassword } });
    res.send({ status: 'Success', payload: user, message: 'Password restored successfully.' })
});

export default sessions;