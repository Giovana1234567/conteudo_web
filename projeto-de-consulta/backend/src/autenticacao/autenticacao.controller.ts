import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AutenticacaoService } from './autenticacao.service';
import { CriarAutenticacaoDto } from './dto/criar-autenticacao.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * O controller AutenticacaoController vai ser usado para receber e tratar as requisições HTTP de login, cadastro, perfil com guarda JWT e CEP,
 * ele pode ser testado com o comando curl -X POST "http://localhost:3007/autenticacao/login"
 * e vai ser importado em AutenticacaoModule para gerenciar os endpoints de segurança da API.
 * 
 * CLI - COMO TESTAR ESTA ROTA VIA TERMINAL:
 * 1. Registrar Novo Usuário (Receberá e-mail de confirmação):
 *    curl -X POST "http://localhost:3007/autenticacao" -H "Content-Type: application/json" -d "{\"name\":\"Cristiano\",\"email\":\"cristiano@email.com\",\"password\":\"senha123\"}"
 * 
 * 2. Realizar Login para obter o Token JWT:
 *    curl -X POST "http://localhost:3007/autenticacao/login" -H "Content-Type: application/json" -d "{\"email\":\"cristiano@email.com\",\"password\":\"senha123\"}"
 *    (Copie o "access_token" retornado)
 * 
 * 3. Acessar Rota Protegida (Perfil) passando o Token JWT no cabeçalho:
 *    curl -X GET "http://localhost:3007/autenticacao/profile" -H "Authorization: Bearer <SEU_TOKEN_AQUI>"
 * 
 * 4. Consultar Endereço por CEP (Consumo de ViaCEP integrado):
 *    curl -X GET "http://localhost:3007/autenticacao/cep?cep=88801000"
 */
@ApiTags('Auth')
@Controller('autenticacao')
export class AutenticacaoController {
  constructor(private readonly authService: AutenticacaoService) {}

  @ApiOperation({ summary: 'Cadastrar nova conta (Gera envio de e-mail)' })
  @Post()
  async create(@Body() createAuthDto: CriarAutenticacaoDto) {
    console.log('[AUTENTICACAO CONTROLLER] Recebida requisição POST /autenticacao (Cadastro)');
    return await this.authService.create(createAuthDto);
  }

  @ApiOperation({ summary: 'Realizar login para obter o Token JWT' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log(`[AUTENTICACAO CONTROLLER] Recebida requisição POST /autenticacao/login para: ${loginDto.email}`);
    return await this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Obter dados do perfil autenticado por JWT' })
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    console.log('[AUTENTICACAO CONTROLLER] Recebida requisição autorizada GET /autenticacao/profile');
    return req.user;
  }

  @ApiOperation({ summary: 'Obter endereço com base no CEP (Consumo externo ViaCEP)' })
  @Get('cep')
  async getAddress(@Query('cep') cep: string) {
    console.log(`[AUTENTICACAO CONTROLLER] Recebida requisição GET /autenticacao/cep para o CEP: ${cep}`);
    return await this.authService.getAddress(cep);
  }
}
