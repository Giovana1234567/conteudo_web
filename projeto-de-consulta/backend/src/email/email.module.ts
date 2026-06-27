import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * O module EmailModule vai ser usado para encapsular e prover o serviço de envio de e-mails,
 * ele pode ser testado com o fluxo de cadastro do AutenticacaoController
 * e vai ser importado em AutenticacaoModule para a função de enviar e-mails aos usuários.
 */
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
