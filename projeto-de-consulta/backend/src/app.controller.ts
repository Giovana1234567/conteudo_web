import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * O controller AppController vai ser usado para receber requisições da raiz do servidor,
 * ele pode ser testado com o endpoint GET /
 * e vai ser importado em AppModule para mapear a rota raiz.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
