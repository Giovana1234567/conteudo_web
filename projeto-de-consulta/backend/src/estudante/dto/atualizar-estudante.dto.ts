import { PartialType } from '@nestjs/mapped-types';
import { CriarEstudanteDto } from './criar-estudante.dto';

/**
 * O dto AtualizarEstudanteDto vai ser usado para receber e validar os dados de atualização parcial de um estudante no MongoDB,
 * ele pode ser testado com o endpoint PATCH /estudante/:id
 * e vai ser importado em EstudanteController para atualizar o estudante com dados validados.
 */
export class AtualizarEstudanteDto extends PartialType(CriarEstudanteDto) {}
