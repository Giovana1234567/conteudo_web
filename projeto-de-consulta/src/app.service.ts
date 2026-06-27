import { Injectable } from '@nestjs/common';

/**
 * O service AppService vai ser usado para retornar a mensagem básica de boas-vindas da API raiz,
 * ele pode ser testado com o endpoint GET /
 * e vai ser importado em AppController para fornecer a string de resposta.
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
