import { Module } from '@nestjs/common';
import { ViacepService } from './viacep.service';

/**
 * O module ViacepModule vai ser usado para encapsular e exportar a integração com a API ViaCEP,
 * ele pode ser testado com a rota GET /auth/cep?cep=88801000
 * e vai ser importado em AutenticacaoModule para consultar endereços com ViaCEP.
 */
@Module({
  providers: [ViacepService],
  exports: [ViacepService],
})
export class ViacepModule {}
