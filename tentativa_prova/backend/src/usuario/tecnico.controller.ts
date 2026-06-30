import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TecnicoService } from './tecnico.service';
import { CriarTecnicoDto } from './dto/criar-tecnico.dto';
import { AtualizarTecnicoDto } from './dto/atualizar-tecnico.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * O controller TecnicoController vai ser usado para receber e tratar as requisições HTTP de usuários,
 * ele pode ser testado com o comando curl -X GET "http://localhost:3007/Tecnico/all"
 * e vai ser importado em TecnicoModule para mapear as rotas de usuários da API.
 * 
 * CLI - COMO TESTAR ESTA ROTA VIA TERMINAL:
 * 1. Listar usuários:
 *    curl -X GET "http://localhost:3007/Tecnico/all?limit=10&offset=0"
 * 
 * 2. Buscar um usuário (ID 1):
 *    curl -X GET "http://localhost:3007/Tecnico/1"
 * 
 * 3. Criar usuário:
 *    curl -X POST "http://localhost:3007/Tecnico" -H "Content-Type: application/json" -d "{\"name\":\"Ana\",\"status\":true}"
 * 
 * 4. Atualizar usuário:
 *    curl -X PUT "http://localhost:3007/Tecnico/1" -H "Content-Type: application/json" -d "{\"name\":\"Ana Souza\"}"
 * 
 * 5. Deletar usuário:
 *    curl -X DELETE "http://localhost:3007/Tecnico/1"
 */
@ApiTags('User')
@Controller('Tecnico')
export class TecnicoController {
  constructor(private readonly userService: TecnicoService) {}

  @ApiOperation({ summary: 'Listar todos os usuários' })
  @Get('all')
  async getAll(@Query() pagination: PaginationDto) {
    console.log('[Tecnico CONTROLLER] Recebida requisição GET /Tecnico/all');
    return await this.userService.getAll(pagination);
  }

  @ApiOperation({ summary: 'Obter um usuário por ID' })
  @Get(':id')
  async getOne(@Param('id') id: number) {
    console.log(`[Tecnico CONTROLLER] Recebida requisição GET /Tecnico/${id}`);
    return await this.userService.getOne(id);
  }

  @ApiOperation({ summary: 'Criar um novo usuário' })
  @Post()
  async create(@Body() body: CriarTecnicoDto) {
    console.log('[Tecnico CONTROLLER] Recebida requisição POST /Tecnico');
    return await this.userService.create(body);
  }

  @ApiOperation({ summary: 'Atualizar completamente um usuário por ID' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: AtualizarTecnicoDto) {
    console.log(`[Tecnico CONTROLLER] Recebida requisição PUT /Tecnico/${id}`);
    return await this.userService.update(id, body);
  }

  @ApiOperation({ summary: 'Atualizar em partes um tecnico por ID' })
  @Patch(':id')
  async updateParcial(@Param('id') id: number, @Body() body: AtualizarTecnicoDto) {
    console.log(`[Tecnico CONTROLLER] Recebida requisição patch /Tecnico/${id}`);
    return await this.userService.update(id, body);
  }

  @ApiOperation({ summary: 'Deletar um usuário por ID' })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    console.log(`[Tecnico CONTROLLER] Recebida requisição DELETE /Tecnico/${id}`);
    return await this.userService.delete(id);
  }
}
