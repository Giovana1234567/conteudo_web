import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * A função bootstrap vai ser usado para inicializar o servidor NestJS, middlewares globais, validações e documentação Swagger,
 * ele pode ser testado com o comando npm run start:dev
 * e vai ser importado em main.ts para executar a inicialização do app.
 */
async function bootstrap() {
  console.log('[BOOTSTRAP] Iniciando a aplicação...');

  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  console.log('[BOOTSTRAP] CORS habilitado com sucesso.');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  console.log('[BOOTSTRAP] ValidationPipe (Validação Global) configurado.');

  const config = new DocumentBuilder()
    .setTitle('API de Consulta - WEB II')
    .setDescription('Documentação dos endpoints de consulta para a prova')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Usuario', 'Operações relacionadas a Usuários (PostgreSQL)')
    .addTag('Aula', 'Operações de Aulas/Classes (PostgreSQL e FK)')
    .addTag('Estudante', 'Operações de Estudantes (MongoDB)')
    .addTag('Autenticacao', 'Operações de Autenticação (JWT)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  console.log('[BOOTSTRAP] Swagger (Documentação) mapeado em /swagger');

  const port = process.env.PORT ?? 3007;
  await app.listen(port);
  console.log(`\n[SERVIDOR] Executando com sucesso em http://localhost:${port}`);
  console.log(`[SERVIDOR] Documentação Swagger disponível em http://localhost:${port}/swagger\n`);
}
bootstrap();
