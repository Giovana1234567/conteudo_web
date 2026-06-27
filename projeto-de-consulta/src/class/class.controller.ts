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
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { DeleteDto } from 'src/common/dto/delete.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * CONTROLADOR: ClassController
 * Expõe endpoints HTTP para CRUD de aulas/classes e relacionamentos FK no PostgreSQL.
 * 
 * Conectividade:
 * - Injeta o `ClassService` para executar a persistência de Aulas e validação de vínculo com usuários.
 * - Registrado no `ClassModule`.
 * 
 * CLI - COMO TESTAR ESTA ROTA VIA TERMINAL:
 * 1. Criar Classe associada a um usuário (ID do usuário = 1):
 *    curl -X POST "http://localhost:3007/class" -H "Content-Type: application/json" -d "{\"name\":\"Matematica\",\"status\":true,\"idUser\":1}"
 * 
 * 2. Listar todas as classes com seus usuários vinculados:
 *    curl -X GET "http://localhost:3007/class/all"
 * 
 * 3. Buscar uma classe por ID:
 *    curl -X GET "http://localhost:3007/class/1"
 * 
 * 4. Atualizar classe:
 *    curl -X PUT "http://localhost:3007/class/1" -H "Content-Type: application/json" -d "{\"name\":\"Fisica Geral\"}"
 * 
 * 5. Deletar classes em lote (passando array de ids via query string):
 *    curl -X DELETE "http://localhost:3007/class/list?ids=1&ids=2"
 * 
 * 6. Deletar classe por ID:
 *    curl -X DELETE "http://localhost:3007/class/1"
 */
@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @ApiOperation({ summary: 'Criar uma nova classe vinculada a um Usuário' })
  @Post()
  create(@Body() body: CreateClassDto) {
    console.log('[CLASS CONTROLLER] Recebida requisição POST /class');
    return this.classService.create(body);
  }

  @ApiOperation({ summary: 'Listar todas as classes trazendo o Usuário relacionado' })
  @Get('all')
  getAll() {
    console.log('[CLASS CONTROLLER] Recebida requisição GET /class/all');
    return this.classService.getAll();
  }

  @ApiOperation({ summary: 'Obter classe por ID' })
  @Get(':id')
  getOne(@Param('id') id: number) {
    console.log(`[CLASS CONTROLLER] Recebida requisição GET /class/${id}`);
    return this.classService.getOne(id);
  }

  @ApiOperation({ summary: 'Atualizar classe por ID' })
  @Put(':id')
  update(@Param('id') id: number, @Body() body: UpdateClassDto) {
    console.log(`[CLASS CONTROLLER] Recebida requisição PUT /class/${id}`);
    return this.classService.update(id, body);
  }

  @ApiOperation({ summary: 'Remover múltiplas classes em lote' })
  @Delete('list')
  deleteList(@Query() query: DeleteDto) {
    console.log('[CLASS CONTROLLER] Recebida requisição DELETE /class/list com IDs:', query.ids);
    return this.classService.deleteList(query.ids);
  }

  @ApiOperation({ summary: 'Deletar classe por ID' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    console.log(`[CLASS CONTROLLER] Recebida requisição DELETE /class/${id}`);
    return this.classService.delete(id);
  }
}
