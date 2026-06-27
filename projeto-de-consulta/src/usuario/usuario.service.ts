import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioEntity } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { Repository } from 'typeorm';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

/**
 * O service UsuarioService vai ser usado para realizar as operações de CRUD de usuários no banco de dados,
 * ele pode ser testado com o endpoint GET /usuario/all
 * e vai ser importado em UsuarioController para retornar as buscas e modificações do banco de dados.
 */
@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly userRepository: Repository<UsuarioEntity>,
  ) {}

  async getAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;
    console.log(`[USUARIO SERVICE] Buscando usuários. Limite: ${limit}, Offset: ${offset}`);

    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    console.log(`[USUARIO SERVICE] Encontrados ${users.length} usuários.`);
    return users;
  }

  async getOne(id: number) {
    console.log(`[USUARIO SERVICE] Buscando usuário pelo ID: ${id}`);
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      console.warn(`[USUARIO SERVICE] Usuário com ID ${id} não foi encontrado.`);
      throw new NotFoundException('Usuário não encontrado');
    }

    console.log(`[USUARIO SERVICE] Usuário ID ${id} encontrado com sucesso.`);
    return user;
  }

  async create(body: CriarUsuarioDto): Promise<any> {
    console.log(`[USUARIO SERVICE] Tentando criar novo usuário: ${body.name}`);
    const user = this.userRepository.create(body);
    const savedUser = await this.userRepository.save(user);
    console.log(`[USUARIO SERVICE] Usuário criado com sucesso. ID: ${savedUser.id}`);
    return savedUser;
  }

  async update(id: number, body: AtualizarUsuarioDto) {
    console.log(`[USUARIO SERVICE] Tentando atualizar usuário ID: ${id}`);
    const user = await this.getOne(id);

    const updateUser = this.userRepository.merge(user, body);
    const savedUser = await this.userRepository.save(updateUser);
    console.log(`[USUARIO SERVICE] Usuário ID ${id} atualizado com sucesso.`);
    return savedUser;
  }

  async delete(id: number) {
    console.log(`[USUARIO SERVICE] Tentando remover usuário ID: ${id}`);
    const user = await this.getOne(id);

    const removedUser = await this.userRepository.remove(user);
    console.log(`[USUARIO SERVICE] Usuário ID ${id} removido com sucesso.`);
    return removedUser;
  }
}
