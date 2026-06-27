import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * O dto CriarAutenticacaoDto vai ser usado para receber e validar os dados de cadastro de uma conta de autenticação,
 * ele pode ser testado com o endpoint POST /autenticacao
 * e vai ser importado em AutenticacaoController para cadastrar a nova conta com dados validados.
 */
export class CriarAutenticacaoDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
