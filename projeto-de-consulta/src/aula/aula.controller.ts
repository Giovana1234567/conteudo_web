import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { AulaService } from './aula.service';
import { CriarAulaDto } from './dto/criar-aula.dto';
import { AtualizarAulaDto } from './dto/atualizar-aula.dto';
import { DeleteDto } from 'src/common/dto/delete.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * O controller AulaController vai ser usado para receber e tratar as requisições HTTP de aulas/classes,
 * ele pode ser testado com o comando curl -X GET "http://localhost:3007/aula/all"
 * e vai ser importado em AulaModule para mapear as rotas de aulas/classes da API.
 * 
 * CLI - COMO TESTAR ESTA ROTA VIA TERMINAL:
 * 1. Criar Classe associada a um usuário (ID do usuário = 1):
 *    curl -X POST "http://localhost:3007/aula" -H "Content-Type: application/json" -d "{\"name\":\"Matematica\",\"status\":true,\"idUser\":1}"
 * 
 * 2. Listar todas as classes com seus usuários vinculados:
 *    curl -X GET "http://localhost:3007/aula/all"
 * 
 * 3. Buscar uma classe por ID:
 *    curl -X GET "http://localhost:3007/aula/1"
 * 
 * 4. Atualizar classe:
 *    curl -X PUT "http://localhost:3007/aula/1" -H "Content-Type: application/json" -d "{\"name\":\"Fisica Geral\"}"
 * 
 * 5. Deletar classes em lote (passando array de ids via query string):
 *    curl -X DELETE "http://localhost:3007/aula/list?ids=1&ids=2"
 * 
 * 6. Deletar classe por ID:
 *    curl -X DELETE "http://localhost:3007/aula/1"
 */
@ApiTags('Class')
@Controller('aula')
export class AulaController {
  constructor(private readonly classService: AulaService) {}

  @ApiOperation({ summary: 'Criar uma nova classe vinculada a um Usuário' })
  @Post()
  create(@Body() body: CriarAulaDto) {
    console.log('[AULA CONTROLLER] Recebida requisição POST /aula');
    return this.classService.create(body);
  }

  @ApiOperation({ summary: 'Listar todas as classes trazendo o Usuário relacionado' })
  @Get('all')
  getAll() {
    console.log('[AULA CONTROLLER] Recebida requisição GET /aula/all');
    return this.classService.getAll();
  }

  @ApiOperation({ summary: 'Obter classe por ID' })
  @Get(':id')
  getOne(@Param('id') id: number) {
    console.log(`[AULA CONTROLLER] Recebida requisição GET /aula/${id}`);
    return this.classService.getOne(id);
  }

  @ApiOperation({ summary: 'Atualizar classe por ID' })
  @Put(':id')
  update(@Param('id') id: number, @Body() body: AtualizarAulaDto) {
    console.log(`[AULA CONTROLLER] Recebida requisição PUT /aula/${id}`);
    return this.classService.update(id, body);
  }

  @ApiOperation({ summary: 'Remover múltiplas classes em lote' })
  @Delete('list')
  deleteList(@Query() query: DeleteDto) {
    console.log('[AULA CONTROLLER] Recebida requisição DELETE /aula/list com IDs:', query.ids);
    return this.classService.deleteList(query.ids);
  }

  @ApiOperation({ summary: 'Deletar classe por ID' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    console.log(`[AULA CONTROLLER] Recebida requisição DELETE /aula/${id}`);
    return this.classService.delete(id);
  }
}
