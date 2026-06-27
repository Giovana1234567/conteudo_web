import { Module } from '@nestjs/common';
import { AulaService } from './aula.service';
import { AulaController } from './aula.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulaEntity } from './entities/aula.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';

/**
 * O module AulaModule vai ser usado para encapsular as rotas e a lógica de persistência de aulas/classes,
 * ele pode ser testado com o endpoint GET /aula/all
 * e vai ser importado em AppModule para registrar o serviço de aulas no container de injeção de dependências do NestJS.
 */
@Module({
  imports: [TypeOrmModule.forFeature([AulaEntity]), UsuarioModule],
  controllers: [AulaController],
  providers: [AulaService],
})
export class AulaModule {}
