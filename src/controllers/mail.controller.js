import __dirname from '../utils.js';
import crypto from 'crypto';
import config from '../config/config.js';
import MailRepository from '../repository/mail.repository.js';

const mailRepository = new MailRepository();

class MailController {
    constructor() {

    }
    
    async sendMail(email, subject, html) {
        try {
            const transport = await mailRepository.transport();

            const mailParams = {
                from: config.gmail_user,
                to: email,
                subject: subject,
                html: html,
            };

            const result = await transport.sendMail(mailParams);
        } catch(error) {
            console.log(error)
        }
    }
}

export default new MailController();