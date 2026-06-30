import { PartialType } from '@nestjs/mapped-types';
import { CriarTecnicoDto } from './criar-tecnico.dto';

/**
 * O dto AtualizarTecnicoDto vai ser usado para receber e validar os dados de atualização de um usuário de forma parcial,
 * ele pode ser testado com o endpoint PUT /Tecnico/:id
 * e vai ser importado em TecnicoController para atualizar os dados do usuário.
 */
export class AtualizarTecnicoDto extends PartialType(CriarTecnicoDto) {}
