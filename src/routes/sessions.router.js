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
        this.users.get('/requestreset', userLogged, MailController.sendMail);
        this.users.post('/resetpassword', userLogged, usersController.resetPassword);
        this.users.get('/current', userLogged, usersController.currentUser);
        this.users.get('/premium/:userEmail', usersController.toggleRole);
        this.users.post('/:userEmail/documents', uploader.fields([
            {name: 'profile', maxCount: 1},
            {name: 'product'},
            {name: 'document', maxCount: 3},
        ]), usersController.fileUpload);
        /* Ruta para realizar el cambio de rol autimatico con el usuario autenticado, necesita modificaciones */
        // this.users.get('/premium-role', userLogged, usersController.autoToggle);
        /* Ruta para realizar el cambio de rol autimatico con el usuario autenticado, necesita modificaciones */
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