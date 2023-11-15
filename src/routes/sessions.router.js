import { Router } from "express";
import MailController from "../controllers/mail.controller.js";
import usersController from "../controllers/users.controller.js";
import { userLogged } from "../middleware/userLogged.js";
import { uploader } from "../utils.js";

class sessionsRouter {
    constructor() {
        this.users = Router();
        this.users.get('/', usersController.getUsers);
        this.users.delete('/', usersController.deleteInactiveUsers);
        this.users.delete('/delete/:userEmail', usersController.deleteUser);
        this.users.post('/register', usersController.register);
        this.users.get('/failedregister', usersController.failedRegister);
        this.users.post('/login', usersController.login);
        this.users.get('/failedlogin', usersController.failedLogin);
        this.users.get('/github', usersController.github);
        this.users.get('/githubcallback', usersController.githubCallback);
        this.users.post('/request-reset/', usersController.sendLink);
        this.users.post('/resetpassword', usersController.resetPassword);
        this.users.get('/current', userLogged, usersController.currentUser);
        this.users.get('/premium/:userId', userLogged, usersController.verifyDocs, usersController.toggleRole);
        this.users.post('/:userEmail/documents', uploader.fields([
            {name: 'profile', maxCount: 1},
            {name: 'product'},
            {name: 'document', maxCount: 3},
        ]), usersController.fileUpload);
    }
}

export default new sessionsRouter().users;

/* Documentation - needs to be updated */
// Ruta para realizar el registro de un usuario: /register y /failedregister
// Ruta para realizar el login de un usuario: /login y /failedlogin
// Rutas necesarias para la estrategia de autenticacion o login con GitHub: /github y /githubcallback
// Ruta para realizar un password reset: /resetpassword
// Ruta para verificar si hay algun usuario autenticado o no: /current
/* Documentation - needs to be updated */