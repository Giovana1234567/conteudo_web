import { PartialType } from '@nestjs/mapped-types';
import { CriarAulaDto } from './criar-aula.dto';

/**
 * O dto AtualizarAulaDto vai ser usado para receber e validar os dados de atualização de uma aula de forma parcial,
 * ele pode ser testado com o endpoint PUT /aula/:id
 * e vai ser importado em AulaController para atualizar a aula com dados validados.
 */
export class AtualizarAulaDto extends PartialType(CriarAulaDto) {}
