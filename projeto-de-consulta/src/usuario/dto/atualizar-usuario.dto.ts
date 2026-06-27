import { PartialType } from '@nestjs/mapped-types';
import { CriarUsuarioDto } from './criar-usuario.dto';

/**
 * O dto AtualizarUsuarioDto vai ser usado para receber e validar os dados de atualização de um usuário de forma parcial,
 * ele pode ser testado com o endpoint PUT /usuario/:id
 * e vai ser importado em UsuarioController para atualizar os dados do usuário.
 */
export class AtualizarUsuarioDto extends PartialType(CriarUsuarioDto) {}
