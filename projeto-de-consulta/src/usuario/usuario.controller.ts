import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * O controller UsuarioController vai ser usado para receber e tratar as requisições HTTP de usuários,
 * ele pode ser testado com o comando curl -X GET "http://localhost:3007/usuario/all"
 * e vai ser importado em UsuarioModule para mapear as rotas de usuários da API.
 * 
 * CLI - COMO TESTAR ESTA ROTA VIA TERMINAL:
 * 1. Listar usuários:
 *    curl -X GET "http://localhost:3007/usuario/all?limit=10&offset=0"
 * 
 * 2. Buscar um usuário (ID 1):
 *    curl -X GET "http://localhost:3007/usuario/1"
 * 
 * 3. Criar usuário:
 *    curl -X POST "http://localhost:3007/usuario" -H "Content-Type: application/json" -d "{\"name\":\"Ana\",\"status\":true}"
 * 
 * 4. Atualizar usuário:
 *    curl -X PUT "http://localhost:3007/usuario/1" -H "Content-Type: application/json" -d "{\"name\":\"Ana Souza\"}"
 * 
 * 5. Deletar usuário:
 *    curl -X DELETE "http://localhost:3007/usuario/1"
 */
@ApiTags('User')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly userService: UsuarioService) {}

  @ApiOperation({ summary: 'Listar todos os usuários' })
  @Get('all')
  async getAll(@Query() pagination: PaginationDto) {
    console.log('[USUARIO CONTROLLER] Recebida requisição GET /usuario/all');
    return await this.userService.getAll(pagination);
  }

  @ApiOperation({ summary: 'Obter um usuário por ID' })
  @Get(':id')
  async getOne(@Param('id') id: number) {
    console.log(`[USUARIO CONTROLLER] Recebida requisição GET /usuario/${id}`);
    return await this.userService.getOne(id);
  }

  @ApiOperation({ summary: 'Criar um novo usuário' })
  @Post()
  async create(@Body() body: CriarUsuarioDto) {
    console.log('[USUARIO CONTROLLER] Recebida requisição POST /usuario');
    return await this.userService.create(body);
  }

  @ApiOperation({ summary: 'Atualizar completamente um usuário por ID' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: AtualizarUsuarioDto) {
    console.log(`[USUARIO CONTROLLER] Recebida requisição PUT /usuario/${id}`);
    return await this.userService.update(id, body);
  }

  @ApiOperation({ summary: 'Deletar um usuário por ID' })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    console.log(`[USUARIO CONTROLLER] Recebida requisição DELETE /usuario/${id}`);
    return await this.userService.delete(id);
  }
}
