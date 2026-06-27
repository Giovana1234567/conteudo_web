# Guia 06 - Autenticação JWT, Segurança, Configurações & Swagger

---

## 1. Configurando CORS no NestJS
O CORS (Cross-Origin Resource Sharing) impede ou permite que aplicações frontend hospedadas em domínios diferentes façam requisições ao seu backend NestJS.

### Configuração no `main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*', // Permite requisições de qualquer origem (ideal para desenvolvimento)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
```

---

## 2. Variáveis de Ambiente (`ConfigModule`)
Para evitar credenciais fixas (hardcoded) no código:

```bash
npm install --save @nestjs/config
```

### Configuração no `app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Disponibiliza as variáveis em qualquer módulo sem re-importar
      envFilePath: '.env', // Caminho do arquivo de configuração
    }),
  ],
})
export class AppModule {}
```

### Lendo valores das variáveis
```typescript
// Usando diretamente:
const host = process.env.POSTGRES_HOST;
```

---

## 3. Autenticação JWT (JSON Web Token)
Para criar rotas restritas e fluxo de login:

```bash
npm install --save @nestjs/jwt passport-jwt @nestjs/passport passport
npm install --save-dev @types/passport-jwt
```

### Módulo de Autenticação (`autenticacao.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AutenticacaoService } from './autenticacao.service';
import { AutenticacaoController } from './autenticacao.controller';
import { JwtEstrategia } from './jwt.estrategia';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'chave_secreta_padrao',
      signOptions: { expiresIn: '1d' }, // Token expira em 1 dia
    }),
  ],
  providers: [AutenticacaoService, JwtEstrategia],
  controllers: [AutenticacaoController],
})
export class AutenticacaoModule {}
```

### Estratégia JWT (`jwt.estrategia.ts`)
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtEstrategia extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o token do Header: Bearer <Token>
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'chave_secreta_padrao',
    });
  }

  async validate(payload: any) {
    // Retorna o que será inserido no objeto request (ex: req.user)
    return { userId: payload.sub, email: payload.email };
  }
}
```

### Guard para Proteger Rotas (`jwt-auth.guard.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### Exemplo de Uso no Controller
```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('perfil')
export class PerfilController {

  @UseGuards(JwtAuthGuard) // Apenas requisições com Token JWT válido entram aqui
  @Get()
  obterPerfil(@Request() req) {
    return {
      mensagem: 'Acesso autorizado!',
      usuarioAutenticado: req.user,
    };
  }
}
```

---

## 4. Envio de E-mails com Nodemailer
O Nodemailer permite disparar e-mails (como confirmação de cadastro ou redefinição de senha).

```bash
npm install --save nodemailer
npm install --save-dev @types/nodemailer
```

### Serviço de E-mail (`email.service.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.ethereal.email',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false, // true para porta 465, false para outras
      auth: {
        user: process.env.MAIL_USER || 'usuario_teste',
        pass: process.env.MAIL_PASS || 'senha_teste',
      },
    });
  }

  async enviarEmail(destinatario: string, assunto: string, texto: string) {
    await this.transporter.sendMail({
      from: '"Web II ESUCRI" <no-reply@esucri.com>',
      to: destinatario,
      subject: assunto,
      text: texto,
    });
  }
}
```

---

## 5. Documentação de APIs com Swagger
O Swagger mapeia automaticamente as rotas e DTOs, fornecendo uma interface interativa web.

```bash
npm install --save @nestjs/swagger
```

### Inicialização do Swagger no `main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Documentação da API - Estudos Web II')
    .setDescription('Referência rápida de endpoints para o exame')
    .setVersion('1.0')
    .addBearerAuth() // Habilita campo para colar o Token JWT de autenticação
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Mapeado em http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();
```
