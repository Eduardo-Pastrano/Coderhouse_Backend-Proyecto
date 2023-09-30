import nodemailer from 'nodemailer';
import config from '../config/config.js';
import { logger } from "../utils/logger.js";

class MailRepository {
    constructor() {
        logger.info("Connected: Repository - Mail")
    }

    async transport() {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: config.gmail_user,
                pass: config.gmail_pass,
            },
        });
        return transport;
    }
}

export default MailRepository;