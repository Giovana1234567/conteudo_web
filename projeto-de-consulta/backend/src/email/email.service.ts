import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

/**
 * O service EmailService vai ser usado para enviar e-mails usando a biblioteca Nodemailer,
 * ele pode ser testado com um disparo de cadastro no AutenticacaoController
 * e vai ser importado em AutenticacaoModule para a função de enviar e-mail de boas-vindas após o registro.
 */
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    console.log('[EMAIL SERVICE] Inicializando transportador SMTP do Nodemailer...');
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.ethereal.email',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER || 'keven.boehm84@ethereal.email',
        pass: process.env.MAIL_PASS || 'Eh9jgdJSh7cZNzYaSu',
      },
    });
    console.log('[EMAIL SERVICE] Transportador SMTP configurado.');
  }

  async sendEmail(to: string, subject: string, content: string) {
    console.log(`[EMAIL SERVICE] Preparando envio de e-mail para: ${to}`);
    const mailOptions = {
      from: 'Cristiano Salomão <cristiano@esucri.com.br>',
      to,
      subject,
      html: content,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] E-mail enviado com sucesso! MessageID: ${info.messageId}`);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[EMAIL SERVICE] E-mail de teste capturado! Visualize aqui: ${previewUrl}`);
      }
      return info;
    } catch (error) {
      console.error(`[EMAIL SERVICE] Falha ao enviar e-mail para ${to}:`, error.message);
      throw error;
    }
  }
}
