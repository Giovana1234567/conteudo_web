import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TecnicoModule } from './usuario/tecnico.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'faculdade_db',
      autoLoadEntities: true, // Carrega entities automaticamente
      synchronize: true,      // Sincroniza tabelas no banco (NÃO usar em produção)
    }),
    TecnicoModule
  ]
 })
export class AppModule {}