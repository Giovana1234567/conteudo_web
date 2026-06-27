import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Exemplo')
    .setDescription('Documentação da API com Swagger')
    .setVersion('1.0')
    .addBearerAuth() // caso esteja usando autenticação JWT
    .addTag('User', 'Dados de usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document)

  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
