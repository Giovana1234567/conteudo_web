import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

/**
 * O dto CriarTecnicoDto vai ser usado para receber e validar os dados de criação de um usuário,
 * ele pode ser testado com o endpoint POST /Tecnico
 * e vai ser importado em TecnicoController para criar o usuário com dados validados.
 */
export class CriarTecnicoDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @Length(11, 11, { message: 'O CPF deve ter exatamente 11 caracteres' })
  @IsNotEmpty()
  readonly cpf: string;

}
