import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * ESTRATÉGIA: JwtStrategy
 * 
 * Conectividade:
 * - Esta classe intercepta e valida os tokens das requisições protegidas pelo `AuthGuard('jwt')`.
 * - Extrai o token Bearer do cabeçalho `Authorization: Bearer <token>`.
 * - Compara a assinatura do token com a palavra-chave configurada (`secretOrKey`).
 * - Se for válido, executa o método `validate()` e o objeto retornado é anexado ao `request.user` (ex: `req.user`).
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    console.log('[JWT STRATEGY] Inicializando estratégia Passport JWT...');
    super({
      // Extrai o JWT do header "Authorization: Bearer <TOKEN>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // Configurado como true para fins de estudos na prova
      secretOrKey: process.env.JWT_SECRET || 'CHAVES', // Segredo de assinatura do token
    });
  }

  /**
   * Executado automaticamente após a verificação de assinatura do Passport JWT.
   * O objeto de retorno é anexado ao Request (`req.user`).
   * @param payload Payload contido dentro do token JWT desencriptado
   */
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