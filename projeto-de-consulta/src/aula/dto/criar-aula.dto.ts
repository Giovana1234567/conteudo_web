import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * O dto CriarAulaDto vai ser usado para receber e validar os dados de criação de uma aula,
 * ele pode ser testado com o endpoint POST /aula
 * e vai ser importado em AulaController para criar a aula com dados validados.
 */
export class CriarAulaDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly status: boolean;

  @IsNumber()
  @IsNotEmpty()
  readonly idUser: number;
}
