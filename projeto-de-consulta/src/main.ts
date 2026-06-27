import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Ponto de entrada da aplicação NestJS.
 * Conecta o AppModule (módulo raiz) ao servidor HTTP e configura middlewares globais.
 */
async function bootstrap() {
  console.log('[BOOTSTRAP] Iniciando a aplicação...');

  // Cria a instância do NestJS a partir do módulo raiz
  const app = await NestFactory.create(AppModule);
  
  // Habilita o CORS global para permitir que o frontend (Next.js/React) acesse a API em diferentes portas
  app.enableCors();
  console.log('[BOOTSTRAP] CORS habilitado com sucesso.');

  // Configura a validação global de entrada de dados (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Remove automaticamente propriedades que não estão descritas no DTO
      forbidNonWhitelisted: true, // Retorna erro HTTP 400 se o cliente enviar propriedades não descritas no DTO
      transform: true,            // Transforma os payloads recebidos para as instâncias de classe correspondentes
    }),
  );
  console.log('[BOOTSTRAP] ValidationPipe (Validação Global) configurado.');

  // Configura a documentação automática de APIs (Swagger)
  // Pode ser testada acessando http://localhost:<PORT>/swagger no navegador
  const config = new DocumentBuilder()
    .setTitle('API de Consulta - WEB II')
    .setDescription('Documentação dos endpoints de consulta para a prova')
    .setVersion('1.0')
    .addBearerAuth() // Adiciona suporte para autenticação com token JWT no Swagger
    .addTag('User', 'Operações relacionadas a Usuários (PostgreSQL)')
    .addTag('Class', 'Operações de Aulas/Classes (PostgreSQL e FK)')
    .addTag('Student', 'Operações de Estudantes (MongoDB)')
    .addTag('Auth', 'Operações de Autenticação (JWT)')
    .addTag('ViaCEP', 'Integração de consumo de API de CEP externa')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  console.log('[BOOTSTRAP] Swagger (Documentação) mapeado em /swagger');

  const port = process.env.PORT ?? 3005;
  await app.listen(port);
  console.log(`\n[SERVIDOR] Executando com sucesso em http://localhost:${port}`);
  console.log(`[SERVIDOR] Documentação Swagger disponível em http://localhost:${port}/swagger\n`);
}
bootstrap();
