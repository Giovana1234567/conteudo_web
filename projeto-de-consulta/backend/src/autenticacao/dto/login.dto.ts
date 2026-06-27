import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * O dto LoginDto vai ser usado para receber e validar as credenciais de login do usuário,
 * ele pode ser testado com o endpoint POST /autenticacao/login
 * e vai ser importado em AutenticacaoController para efetuar o login e obter o token JWT.
 */
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}