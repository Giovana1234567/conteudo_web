import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { ViacepService } from 'src/viacep/viacep.service';

/**
 * SERVIÇO: AuthService
 * 
 * Conectividade:
 * - Responsável pela lógica de segurança, cadastro e login de usuários na plataforma.
 * - Conecta-se ao `AuthEntity` (tabela do Postgres).
 * - Utiliza `JwtService` para assinar o token JWT após o login bem-sucedido.
 * - Utiliza `MailerService` (Nodemailer) para disparar e-mails de boas-vindas após o cadastro.
 * - Utiliza `ViacepService` para consumir a API externa ViaCEP quando requisitado no fluxo de endereço.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,  // Conectividade: Disparo de emails
    private readonly viacepService: ViacepService,  // Conectividade: Consumo de API externa
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    console.log(`[AUTH SERVICE] Registrando novo usuário de autenticação: ${createAuthDto.email}`);
    
    const existingAuth = await this.authRepository.findOne({
      where: { email: createAuthDto.email }
    });
    
    if (existingAuth) {
      console.warn(`[AUTH SERVICE] Tentativa de cadastro com e-mail duplicado: ${createAuthDto.email}`);
      throw new ConflictException('E-mail já registrado');
    }

    // Criptografia da senha usando bcrypt (10 rounds de salt)
    const passwordHash = await bcrypt.hash(createAuthDto.password, 10);

    const newAuth = {
      name: createAuthDto.name,
      email: createAuthDto.email,
      password: passwordHash,
    };

    const auth = this.authRepository.create(newAuth);
    const savedAuth = await this.authRepository.save(auth);
    console.log(`[AUTH SERVICE] Usuário registrado no banco Postgres. ID: ${savedAuth.id}`);

    // Dispara e-mail de boas-vindas de forma assíncrona
    try {
      console.log(`[AUTH SERVICE] Disparando e-mail de boas-vindas para: ${newAuth.email}`);
      await this.mailerService.sendEmail(
        newAuth.email,
        'Conta criada com sucesso!',
        `Olá ${newAuth.name}, <br>Seu e-mail ${newAuth.email} foi cadastrado com sucesso no sistema de consulta!`
      );
      console.log('[AUTH SERVICE] E-mail de boas-vindas enviado com sucesso.');
    } catch (error) {
      console.error('[AUTH SERVICE] Falha ao enviar e-mail de boas-vindas.', error);
    }

    return savedAuth;
  }

  async findUserByEmail(email: string) {
    return await this.authRepository.findOne({
      where: { email }
    });
  }

  async login(loginDto: LoginDto) {
    console.log(`[AUTH SERVICE] Tentativa de login para o e-mail: ${loginDto.email}`);
    const auth = await this.findUserByEmail(loginDto.email);
    
    const isMatch = await bcrypt.compare(loginDto.password, auth?.password ?? '');

    if (!auth || !isMatch) {
      console.warn(`[AUTH SERVICE] Falha na autenticação do e-mail: ${loginDto.email}`);
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // Criação do payload do Token JWT
    const payload = { sub: auth.id, email: auth.email, name: auth.name };
    console.log(`[AUTH SERVICE] Login bem-sucedido para ${auth.email}. Gerando token JWT...`);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getAddress(cep: string) {
    console.log(`[AUTH SERVICE] Solicitando endereço para o CEP: ${cep}`);
    return this.viacepService.getAddress(cep);
  }
}
