import { Module } from '@nestjs/common';
import { TecnicoService } from './tecnico.service';
import { TecnicoController } from './tecnico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TecnicoEntity } from './entities/tecnico.entity';

/**
 * O module TecnicoModule vai ser usado para encapsular a lógica de persistência e rotas de usuários,
 * ele pode ser testado com o endpoint GET /Tecnico/all
 * e vai ser importado em AppModule e AulaModule para compartilhar o serviço de usuários com outros módulos.
 */
@Module({
  imports: [TypeOrmModule.forFeature([TecnicoEntity])],
  controllers: [TecnicoController],
  providers: [TecnicoService],
  exports: [TecnicoService],
})
export class TecnicoModule {}
