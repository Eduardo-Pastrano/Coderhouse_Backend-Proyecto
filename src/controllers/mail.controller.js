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

    // async sendMail(req, res) {
    //     try {
    //         const transport = await mailRepository.transport();
    //         const token = crypto.randomBytes(20).toString('hex');

    //         req.session.resetPassword = { 
    //             token: token, 
    //             expires: Date.now() + 3600000
    //         };

    //         const link = `http://localhost:8080/resetpassword/${token}`;

    //         const mailParams = {
    //             from: config.gmail_user,
    //             to: 'epastranom@gmail.com',
    //             subject: 'Password reset link',
    //             html: `<div> <h1>Forgot your password?</h1> </div>
    //                     <div> <p>Click or copy this link: ${link}</p> </div>
    //             `,
    //         };

    //         const result = await transport.sendMail(mailParams);
    //         res.render('checkEmail')
    //     } catch(error) {
    //         console.log(error)
    //     }
    // }