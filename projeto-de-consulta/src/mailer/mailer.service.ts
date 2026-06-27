import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

/**
 * SERVIÇO: MailerService (Nodemailer)
 * 
 * Conectividade:
 * - Gerencia o envio de e-mails usando a biblioteca Nodemailer.
 * - Conecta-se a um servidor SMTP configurado. Por padrão, utiliza o Ethereal SMTP (serviço de testes de e-mail).
 * - É consumido pelo `AuthService` para notificar usuários no momento de criação de conta.
 * - Registrado no `MailerModule` (exportado para compartilhamento com outros módulos).
 */
@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    console.log('[MAILER SERVICE] Inicializando transportador SMTP do Nodemailer...');
    
    // Configura o transportador com dados padronizados (ou fallback para conta Ethereal de testes)
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.ethereal.email',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, // true para porta 465 (SSL), false para outras (TLS)
      auth: {
        user: process.env.MAIL_USER || 'keven.boehm84@ethereal.email',
        pass: process.env.MAIL_PASS || 'Eh9jgdJSh7cZNzYaSu',
      },
    });

    console.log('[MAILER SERVICE] Transportador SMTP configurado.');
  }

  /**
   * Envia um e-mail em formato HTML
   * @param to Destinatário
   * @param subject Assunto do e-mail
   * @param content Conteúdo HTML
   */
  async sendEmail(to: string, subject: string, content: string) {
    console.log(`[MAILER SERVICE] Preparando envio de e-mail para: ${to}`);
    
    const mailOptions = {
      from: 'Cristiano Salomão <cristiano@esucri.com.br>',
      to,
      subject,
      html: content,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[MAILER SERVICE] E-mail enviado com sucesso! MessageID: ${info.messageId}`);
      
      // Se for o Ethereal, loga a URL de visualização do e-mail enviado para o aluno depurar no console
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[MAILER SERVICE] E-mail de teste capturado! Visualize aqui: ${previewUrl}`);
      }
      return info;
    } catch (error) {
      console.error(`[MAILER SERVICE] Falha ao enviar e-mail para ${to}:`, error.message);
      throw error;
    }
  }
}
