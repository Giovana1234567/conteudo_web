import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * CONTROLADOR: AuthController
 * Expõe endpoints HTTP para Registro, Login, Acesso a Perfil Restrito (JWT) e consulta de CEP.
 * 
 * Conectividade:
 * - Injeta o `AuthService` para realizar a validação de regras de segurança e autenticação.
 * - Registrado no `AuthModule`.
 * 
 * CLI - COMO TESTAR ESTA ROTA VIA TERMINAL:
 * 1. Registrar Novo Usuário (Receberá e-mail de confirmação):
 *    curl -X POST "http://localhost:3007/auth" -H "Content-Type: application/json" -d "{\"name\":\"Cristiano\",\"email\":\"cristiano@email.com\",\"password\":\"senha123\"}"
 * 
 * 2. Realizar Login para obter o Token JWT:
 *    curl -X POST "http://localhost:3007/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"cristiano@email.com\",\"password\":\"senha123\"}"
 *    (Copie o "access_token" retornado)
 * 
 * 3. Acessar Rota Protegida (Perfil) passando o Token JWT no cabeçalho:
 *    curl -X GET "http://localhost:3007/auth/profile" -H "Authorization: Bearer <SEU_TOKEN_AQUI>"
 * 
 * 4. Consultar Endereço por CEP (Consumo de ViaCEP integrado):
 *    curl -X GET "http://localhost:3007/auth/cep?cep=88801000"
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Cadastrar nova conta (Gera envio de e-mail)' })
  @Post()
  async create(@Body() createAuthDto: CreateAuthDto) {
    console.log('[AUTH CONTROLLER] Recebida requisição POST /auth (Cadastro)');
    return await this.authService.create(createAuthDto);
  }

  @ApiOperation({ summary: 'Realizar login para obter o Token JWT' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log(`[AUTH CONTROLLER] Recebida requisição POST /auth/login para: ${loginDto.email}`);
    return await this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Obter dados do perfil autenticado por JWT' })
  @Get('profile')
  @UseGuards(AuthGuard('jwt')) // Bloqueia acesso caso o token seja inválido/ausente
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    console.log('[AUTH CONTROLLER] Recebida requisição autorizada GET /auth/profile');
    return req.user; // Injetado pelo JwtStrategy
  }

  @ApiOperation({ summary: 'Obter endereço com base no CEP (Consumo externo ViaCEP)' })
  @Get('cep')
  async getAddress(@Query('cep') cep: string) {
    console.log(`[AUTH CONTROLLER] Recebida requisição GET /auth/cep para o CEP: ${cep}`);
    return await this.authService.getAddress(cep);
  }
}
