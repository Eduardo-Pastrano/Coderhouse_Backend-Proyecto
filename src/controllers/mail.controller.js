import __dirname from '../utils.js';
import path from 'path';
import MailRepository from '../repository/mail.repository.js';

const mailRepository = new MailRepository();

class MailController {
    async sendMail(req, res) {
        try {
            const transport = await mailRepository.transport();
            const mailParams = {
                from: 'epastranom@gmail.com',
                to: 'epastranom@gmail.com, eduardo.pastrano96@gmail.com',
                subject: 'Email test from the server with an attachment',
                html: `<div> <h1>This is a test</h1> </div>`,
                attachments: [{
                    filename: 'test.jpeg',
                    path: path.join(process.cwd(), '../src/public/test.jpg'),
                    cid: 'test'
                }]

            };

            const result = await transport.sendMail(mailParams);
            res.send('Mail enviado')
        } catch(error) {
            console.log(error)
        }
    }
}

export default new MailController();