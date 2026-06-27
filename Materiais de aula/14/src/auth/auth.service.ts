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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private viacepService: ViacepService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const existingAuth = await this.authRepository.findOne({
      where: { email: createAuthDto.email }
    });
    
    if (existingAuth) throw new ConflictException('E-mail já registrado');

    const passwordHash = await bcrypt.hash(createAuthDto.password, 10);

    const newAuth = {
      name: createAuthDto.name,
      email: createAuthDto.email,
      password: passwordHash,
    };

    const auth = this.authRepository.create(newAuth);

    await this.mailerService.sendEmail(
      newAuth.email,
      'Conta criada com sucesso!',
      `Olá ${newAuth.name}, <br>Seu e-mail ${newAuth.email} foi cadastrado com sucesso!`
    );

    return this.authRepository.save(auth);
  }

  async findUserByEmail(email: string) {
    const auth = await this.authRepository.findOne({
      where: { email }
    });

    return auth;
  }

  async login(loginDto: LoginDto) {
    const auth = await this.findUserByEmail(loginDto.email);
    
    const isMatch = await bcrypt.compare(loginDto.password, auth?.password ?? '');

    if (!auth || !isMatch) throw new UnauthorizedException();

    const payload = { sub: auth.id, email: auth.email, name: auth.name };

    return { access_token: this.jwtService.sign(payload) };
  }

  async getAddress(cep: string) {
    return this.viacepService.getAddress(cep);
  }
}
