import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'keven.boehm84@ethereal.email',
                pass: 'Eh9jgdJSh7cZNzYaSu'
            }
        })
    }

    async sendEmail(to: string, subject: string, content: string) {
        const mailOptions = {
            from: 'Cristiano Salomão <cristiano@esucri.com.br>',
            to,
            subject,
            // text: content,
            html: content,
        }

        await this.transporter.sendMail(mailOptions);
    }
}
