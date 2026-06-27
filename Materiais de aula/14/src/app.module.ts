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
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'mongoConnection',
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'programacaoweb',
      entities: [StudentEntity], // Diferente no MongoDB
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'pictures'),
      serveRoot: '/img/pictures', // http://localhost:3005/img/pictures/
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
