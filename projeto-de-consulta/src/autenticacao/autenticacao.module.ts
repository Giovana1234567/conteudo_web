import { Module } from '@nestjs/common';
import { AutenticacaoService } from './autenticacao.service';
import { AutenticacaoController } from './autenticacao.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacaoEntity } from './entities/autenticacao.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtEstrategia } from 'src/common/strategies/jwt.estrategia';
import { EmailModule } from 'src/email/email.module';
import { ViacepModule } from 'src/viacep/viacep.module';

/**
 * O module AutenticacaoModule vai ser usado para encapsular as chaves de assinatura, strategies e controle de endpoints de autenticação JWT,
 * ele pode ser testado com o endpoint POST /autenticacao/login
 * e vai ser importado em AppModule para registrar as dependências de segurança e controle de sessões da aplicação.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AutenticacaoEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'CHAVES',
      signOptions: {
        expiresIn: '1d',
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EmailModule,
    ViacepModule,
  ],
  controllers: [AutenticacaoController],
  providers: [AutenticacaoService, JwtEstrategia],
  exports: [PassportModule, JwtModule],
})
export class AutenticacaoModule {}
