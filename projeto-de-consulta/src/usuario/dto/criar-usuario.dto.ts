import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

/**
 * O dto CriarUsuarioDto vai ser usado para receber e validar os dados de criação de um usuário,
 * ele pode ser testado com o endpoint POST /usuario
 * e vai ser importado em UsuarioController para criar o usuário com dados validados.
 */
export class CriarUsuarioDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly status: boolean;
}
