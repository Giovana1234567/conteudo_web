import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * O dto CriarEstudanteDto vai ser usado para receber e validar os dados de criação de um estudante no MongoDB,
 * ele pode ser testado com o endpoint POST /estudante
 * e vai ser importado em EstudanteController para criar o estudante com dados validados.
 */
export class CriarEstudanteDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  courseId: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsOptional()
  photoUrl?: string;
}
