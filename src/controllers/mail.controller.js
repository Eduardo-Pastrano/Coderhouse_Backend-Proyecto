import __dirname from '../utils.js';
import crypto from 'crypto';
import MailRepository from '../repository/mail.repository.js';

const mailRepository = new MailRepository();

class MailController {
    async sendMail(req, res) {
        try {
            const transport = await mailRepository.transport();
            const token = crypto.randomBytes(20).toString('hex');

            req.session.resetPassword = { 
                token: token, 
                expires: Date.now() + 180000 // 180000 milliseconds = 3 minutes
            };

            const link = `http://localhost:8080/resetpassword/${token}`;

            const mailParams = {
                from: 'epastranom@gmail.com',
                to: 'epastranom@gmail.com',
                subject: 'Password reset link',
                html: `<div> <h1>Forgot your password?</h1> </div>
                        <div> <p>Click or copy this link: ${link}</p> </div>
                `,
            };

            const result = await transport.sendMail(mailParams);
            res.send('Mail enviado')
        } catch(error) {
            console.log(error)
        }
    }
}

export default new MailController();