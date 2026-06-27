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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
    TypeOrmModule.forRoot({
      name: 'mongoConnection',
      type: 'mongodb',
      host: process.env.MONGO_HOST || 'localhost',
      port: Number(process.env.MONGO_PORT) || 27017,
      database: process.env.MONGO_DB || 'programacaoweb',
      entities: [StudentEntity],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'pictures'),
      serveRoot: '/img/pictures',
    }),
    UserModule,
    ClassModule,
    StudentModule,
    AuthModule,
    MailerModule,
    ViacepModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
