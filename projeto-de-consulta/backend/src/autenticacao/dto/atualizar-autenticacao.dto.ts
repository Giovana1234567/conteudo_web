import { PartialType } from '@nestjs/mapped-types';
import { CriarAutenticacaoDto } from './criar-autenticacao.dto';

/**
 * O dto AtualizarAutenticacaoDto vai ser usado para receber e validar os dados de alteração parcial de uma conta de autenticação,
 * ele pode ser testado com o endpoint PUT /autenticacao/:id
 * e vai ser importado em AutenticacaoController para atualizar a conta de autenticação.
 */
export class AtualizarAutenticacaoDto extends PartialType(CriarAutenticacaoDto) {}
