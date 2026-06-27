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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * CONTROLADOR: UserController
 * Expõe os endpoints HTTP para gerenciar usuários (PostgreSQL).
 * 
 * Conectividade:
 * - Injeta o `UserService` para delegar as operações de persistência e regras de negócio.
 * - Registrado no `UserModule`.
 * 
 * CLI - COMO TESTAR ESTA ROTA VIA TERMINAL:
 * 1. Listar usuários:
 *    curl -X GET "http://localhost:3007/user/all?limit=10&offset=0"
 * 
 * 2. Buscar um usuário (ID 1):
 *    curl -X GET "http://localhost:3007/user/1"
 * 
 * 3. Criar usuário:
 *    curl -X POST "http://localhost:3007/user" -H "Content-Type: application/json" -d "{\"name\":\"Ana\",\"email\":\"ana@email.com\",\"password\":\"123456\",\"status\":true}"
 * 
 * 4. Atualizar usuário:
 *    curl -X PUT "http://localhost:3007/user/1" -H "Content-Type: application/json" -d "{\"name\":\"Ana Souza\"}"
 * 
 * 5. Deletar usuário:
 *    curl -X DELETE "http://localhost:3007/user/1"
 */
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Listar todos os usuários' })
  @Get('all')
  async getAll(@Query() pagination: PaginationDto) {
    console.log('[USER CONTROLLER] Recebida requisição GET /user/all');
    return await this.userService.getAll(pagination);
  }

  @ApiOperation({ summary: 'Obter um usuário por ID' })
  @Get(':id')
  async getOne(@Param('id') id: number) {
    console.log(`[USER CONTROLLER] Recebida requisição GET /user/${id}`);
    return await this.userService.getOne(id);
  }

  @ApiOperation({ summary: 'Criar um novo usuário' })
  @Post()
  async create(@Body() body: CreateUserDto) {
    console.log('[USER CONTROLLER] Recebida requisição POST /user');
    return await this.userService.create(body);
  }

  @ApiOperation({ summary: 'Atualizar completamente um usuário por ID' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    console.log(`[USER CONTROLLER] Recebida requisição PUT /user/${id}`);
    return await this.userService.update(id, body);
  }

  @ApiOperation({ summary: 'Deletar um usuário por ID' })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    console.log(`[USER CONTROLLER] Recebida requisição DELETE /user/${id}`);
    return await this.userService.delete(id);
  }
}
