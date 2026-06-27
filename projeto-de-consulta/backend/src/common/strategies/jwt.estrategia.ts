import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * O strategy JwtEstrategia vai ser usado para validar a assinatura do token JWT e injetar o payload decodificado no request.user,
 * ele pode ser testado com o endpoint GET /autenticacao/profile enviando o token no header Authorization
 * e vai ser importado em AutenticacaoModule para validar sessões de usuários.
 */
@Injectable()
export class JwtEstrategia extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    console.log('[JWT STRATEGY] Inicializando estratégia Passport JWT...');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET || 'CHAVES',
    });
  }

  async validate(payload: any) {
    console.log(`[JWT STRATEGY] Validando payload de token JWT decodificado para o usuário: ${payload.email}`);
    if (!payload || !payload.email) {
      console.warn('[JWT STRATEGY] Token sem informações básicas de usuário no payload.');
      throw new UnauthorizedException('Token inválido ou corrompido');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}