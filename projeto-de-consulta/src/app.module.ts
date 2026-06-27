import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ClassModule } from './class/class.module';
import { StudentModule } from './student/student.module';
import { StudentEntity } from './student/entities/student.entity';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from './mailer/mailer.module';
import { ViacepModule } from './viacep/viacep.module';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';

/**
 * Módulo Raiz da Aplicação.
 * Este arquivo centraliza todas as configurações globais de bancos de dados,
 * variáveis de ambiente, servidores estáticos e declara os módulos de funcionalidades.
 */
@Module({
  imports: [
    // 1. ConfigModule: Carrega e disponibiliza as variáveis do arquivo .env em todo o sistema.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. TypeOrmModule (Postgres - Padrão): Gerencia a persistência de dados relacionais.
    // Usado pelos módulos: UserModule, ClassModule.
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASS || 'postgres',
      database: process.env.POSTGRES_DB || 'programacaoweb',
      autoLoadEntities: true, // Registra automaticamente entidades associadas a esta conexão
      synchronize: true,      // Sincroniza tabelas no banco. Útil para desenvolvimento/prova.
    }),

    // 3. TypeOrmModule (MongoDB - Conexão Nomeada): Gerencia a persistência de documentos MongoDB.
    // Injetada explicitamente no StudentModule com o nome 'mongoConnection'.
    TypeOrmModule.forRoot({
      name: 'mongoConnection',
      type: 'mongodb',
      host: process.env.MONGO_HOST || 'localhost',
      port: Number(process.env.MONGO_PORT) || 27017,
      database: process.env.MONGO_DB || 'programacaoweb',
      entities: [StudentEntity], // Entidade específica para esta conexão noSQL
    }),

    // 4. ServeStaticModule: Disponibiliza o acesso a arquivos locais via HTTP (ex: imagens salvas de uploads).
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'pictures'),
      serveRoot: '/img/pictures', // Acessível via http://localhost:<PORT>/img/pictures/<nome_arquivo>
    }),

    // 5. Módulos de Funcionalidades
    UserModule,     // Lida com CRUD de usuários (Postgres)
    ClassModule,    // Lida com CRUD de aulas/relacionamentos (Postgres, com dependência em UserModule)
    StudentModule,  // Lida com estudantes, uploads de arquivos e agrupamento (MongoDB)
    AuthModule,     // Lida com geração de JWT, login e criptografia (Conecta-se com User/AuthEntity e Mailer)
    MailerModule,   // Serviço de envio de e-mails usando Nodemailer
    ViacepModule,   // Módulo para consumo de API externa (ViaCEP) via HTTP
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
