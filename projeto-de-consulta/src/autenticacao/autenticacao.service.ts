import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CriarAutenticacaoDto } from './dto/criar-autenticacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AutenticacaoEntity } from './entities/autenticacao.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { ViacepService } from 'src/viacep/viacep.service';

/**
 * O service AutenticacaoService vai ser usado para realizar cadastro, login com hash de senha, validação de JWT, consulta externa ao ViaCEP e disparos de e-mail,
 * ele pode ser testado com o endpoint POST /autenticacao/login
 * e vai ser importado em AutenticacaoController para gerenciar os fluxos de segurança e integrações.
 */
@Injectable()
export class AutenticacaoService {
  constructor(
    @InjectRepository(AutenticacaoEntity)
    private readonly authRepository: Repository<AutenticacaoEntity>,
    private readonly jwtService: JwtService,
    private readonly mailerService: EmailService,
    private readonly viacepService: ViacepService,
  ) {}

  async create(createAuthDto: CriarAutenticacaoDto) {
    console.log(`[AUTENTICACAO SERVICE] Cadastrando conta: ${createAuthDto.email}`);
    const existingAuth = await this.authRepository.findOne({
      where: { email: createAuthDto.email }
    });
    
    if (existingAuth) {
      console.warn(`[AUTENTICACAO SERVICE] E-mail já cadastrado: ${createAuthDto.email}`);
      throw new ConflictException('E-mail já registrado');
    }

    const passwordHash = await bcrypt.hash(createAuthDto.password, 10);

    const newAuth = {
      name: createAuthDto.name,
      email: createAuthDto.email,
      password: passwordHash,
    };

    const auth = this.authRepository.create(newAuth);
    const saved = await this.authRepository.save(auth);
    console.log(`[AUTENTICACAO SERVICE] Conta criada com sucesso no Postgres. ID: ${saved.id}`);

    try {
      console.log(`[AUTENTICACAO SERVICE] Enviando email para: ${newAuth.email}`);
      await this.mailerService.sendEmail(
        newAuth.email,
        'Conta criada com sucesso!',
        `Olá ${newAuth.name}, <br>Seu e-mail ${newAuth.email} foi cadastrado com sucesso no sistema de consulta!`
      );
      console.log('[AUTENTICACAO SERVICE] Email enviado com sucesso.');
    } catch (error) {
      console.error('[AUTENTICACAO SERVICE] Erro ao enviar email de boas-vindas:', error.message);
    }

    return saved;
  }

  async findUserByEmail(email: string) {
    return await this.authRepository.findOne({
      where: { email }
    });
  }

  async login(loginDto: LoginDto) {
    console.log(`[AUTENTICACAO SERVICE] Tentando login para: ${loginDto.email}`);
    const auth = await this.findUserByEmail(loginDto.email);
    const isMatch = await bcrypt.compare(loginDto.password, auth?.password ?? '');

    if (!auth || !isMatch) {
      console.warn(`[AUTENTICACAO SERVICE] Login incorreto para: ${loginDto.email}`);
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    const payload = { sub: auth.id, email: auth.email, name: auth.name };
    console.log(`[AUTENTICACAO SERVICE] Credenciais válidas. Emitindo JWT...`);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getAddress(cep: string) {
    console.log(`[AUTENTICACAO SERVICE] Obtendo cep: ${cep}`);
    return await this.viacepService.getAddress(cep);
  }
}
