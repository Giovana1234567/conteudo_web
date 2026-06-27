import { Module } from '@nestjs/common';
import { EstudanteService } from './estudante.service';
import { EstudanteController } from './estudante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudanteEntity } from './entities/estudante.entity';

/**
 * O module EstudanteModule vai ser usado para encapsular as rotas e persistência de estudantes no MongoDB,
 * ele pode ser testado com o endpoint GET /estudante/all
 * e vai ser importado em AppModule para registrar os endpoints de estudante e a conexão MongoDB.
 */
@Module({
  imports: [TypeOrmModule.forFeature([EstudanteEntity], 'mongoConnection')],
  controllers: [EstudanteController],
  providers: [EstudanteService],
})
export class EstudanteModule {}
