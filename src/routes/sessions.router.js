import { Router } from "express";
import usersController from "../controllers/users.controller.js";

class sessionsRouter {
    constructor() {
        this.users = Router();
        this.users.post('/register', usersController.register);
        this.users.get('/failedregister', usersController.failedRegister);
        this.users.post('/login', usersController.login);
        this.users.get('/failedlogin', usersController.failedLogin);
        this.users.get('/github', usersController.github);
        this.users.get('/githubcallback', usersController.githubCallback);
        this.users.get('/resetpassword', usersController.resetPassword);
        this.users.get('/current', usersController.currentUser);
    }
}

export default new sessionsRouter().users;

/* Documentation */
// Ruta para realizar el registro de un usuario: /register
// Ruta para realizar el login de un usuario:
// Rutas necesarias para la estrategia de autenticacion o login con GitHub:
// Ruta para realizar un password reset:
// Ruta para verificar si hay algun usuario autenticado o no:
/* Documentation */