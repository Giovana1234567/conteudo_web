import { Injectable, NotFoundException } from '@nestjs/common';
import { TecnicoEntity } from './entities/tecnico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CriarTecnicoDto } from './dto/criar-tecnico.dto';
import { Repository } from 'typeorm';
import { AtualizarTecnicoDto } from './dto/atualizar-tecnico.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

/**
 * O service TecnicoService vai ser usado para realizar as operações de CRUD de Tecnico no banco de dados,
 * ele pode ser testado com o endpoint GET /Tecnico/all
 * e vai ser importado em TecnicoController para retornar as buscas e modificações do banco de dados.
 */
@Injectable()
export class TecnicoService {
  constructor(
    @InjectRepository(TecnicoEntity)
    private readonly userRepository: Repository<TecnicoEntity>,
  ) {}

  async getAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;
    console.log(`[Tecnico SERVICE] Buscando Tecnico. Limite: ${limit}, Offset: ${offset}`);

    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
      },
    });

    console.log(`[Tecnico SERVICE] Encontrados ${users.length} Tecnico.`);
    return users;
  }

  async getOne(id: number) {
    console.log(`[Tecnico SERVICE] Buscando usuário pelo ID: ${id}`);
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      console.warn(`[Tecnico SERVICE] Usuário com ID ${id} não foi encontrado.`);
      throw new NotFoundException('Usuário não encontrado');
    }

    console.log(`[Tecnico SERVICE] Usuário ID ${id} encontrado com sucesso.`);
    return user;
  }

  async create(body: CriarTecnicoDto): Promise<any> {
    console.log(`[Tecnico SERVICE] Tentando criar novo usuário: ${body.name}`);
    const user = this.userRepository.create(body);
    const savedUser = await this.userRepository.save(user);
    console.log(`[Tecnico SERVICE] Usuário criado com sucesso. ID: ${savedUser.id}`);
    return savedUser;
  }

  async update(id: number, body: AtualizarTecnicoDto) {
    console.log(`[Tecnico SERVICE] Tentando atualizar usuário ID: ${id}`);
    const user = await this.getOne(id);

    const updateUser = this.userRepository.merge(user, body);
    const savedUser = await this.userRepository.save(updateUser);
    console.log(`[Tecnico SERVICE] Usuário ID ${id} atualizado com sucesso.`);
    return savedUser;
  }

  async delete(id: number) {
    console.log(`[Tecnico SERVICE] Tentando remover usuário ID: ${id}`);
    const user = await this.getOne(id);

    const removedUser = await this.userRepository.remove(user);
    console.log(`[Tecnico SERVICE] Usuário ID ${id} removido com sucesso.`);
    return removedUser;
  }
}
