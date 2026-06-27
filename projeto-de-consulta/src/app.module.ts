import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { AulaModule } from './aula/aula.module';
import { EstudanteModule } from './estudante/estudante.module';
import { EstudanteEntity } from './estudante/entities/estudante.entity';
import { AutenticacaoModule } from './autenticacao/autenticacao.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EmailModule } from './email/email.module';
import { ViacepModule } from './viacep/viacep.module';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';

/**
 * O module AppModule vai ser usado para centralizar todas as configurações globais de bancos de dados (PostgreSQL/MongoDB), variáveis de ambiente, servidores estáticos e registrar os módulos de funcionalidades,
 * ele pode ser testado com a inicialização da aplicação NestJS com npm run start:dev
 * e vai ser importado em main.ts para carregar e inicializar o aplicativo.
 */
@Module({
  imports: [
    // 1. ConfigModule: Carrega e disponibiliza as variáveis do arquivo .env em todo o sistema.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. TypeOrmModule (Postgres - Padrão): Gerencia a persistência de dados relacionais.
    // Usado pelos módulos: UsuarioModule, AulaModule.
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASS || 'postgres',
      database: process.env.POSTGRES_DB || 'programacaoweb',
      autoLoadEntities: true,
      synchronize: true,
    }),

    // 3. TypeOrmModule (MongoDB - Conexão Nomeada): Gerencia a persistência de documentos MongoDB.
    // Injetada explicitamente no EstudanteModule com o nome 'mongoConnection'.
    TypeOrmModule.forRoot({
      name: 'mongoConnection',
      type: 'mongodb',
      host: process.env.MONGO_HOST || 'localhost',
      port: Number(process.env.MONGO_PORT) || 27017,
      database: process.env.MONGO_DB || 'programacaoweb',
      entities: [EstudanteEntity],
    }),

    // 4. ServeStaticModule: Disponibiliza o acesso a arquivos locais via HTTP (ex: imagens salvas de uploads).
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'pictures'),
      serveRoot: '/img/pictures',
    }),

    // 5. Módulos de Funcionalidades em Português
    UsuarioModule,
    AulaModule,
    EstudanteModule,
    AutenticacaoModule,
    EmailModule,
    ViacepModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
