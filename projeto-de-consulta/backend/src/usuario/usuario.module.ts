import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/usuario.entity';

/**
 * O module UsuarioModule vai ser usado para encapsular a lógica de persistência e rotas de usuários,
 * ele pode ser testado com o endpoint GET /usuario/all
 * e vai ser importado em AppModule e AulaModule para compartilhar o serviço de usuários com outros módulos.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
