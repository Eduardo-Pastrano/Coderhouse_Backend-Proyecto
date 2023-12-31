import { Router } from "express";
import MailController from "../controllers/mail.controller.js";

class mailRouter {
    constructor() {
        this.mail = Router();
        this.mail.get('/requestreset', MailController.sendMail);
    }
}

export default new mailRouter().mail;