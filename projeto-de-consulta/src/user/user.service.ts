import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

/**
 * SERVIÇO: UserService (PostgreSQL)
 * 
 * Conectividade:
 * - Gerencia a persistência de dados de usuários no PostgreSQL usando TypeORM.
 * - Injeta o repository `Repository<UserEntity>` registrado pelo `TypeOrmModule.forFeature([UserEntity])` no `UserModule`.
 * - É consumido diretamente por `UserController` para expor o CRUD HTTP.
 * - É exportado no `UserModule` e importado pelo `AuthModule` para validar credenciais no login.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;
    console.log(`[USER SERVICE] Buscando usuários. Limite: ${limit}, Offset: ${offset}`);

    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    console.log(`[USER SERVICE] Encontrados ${users.length} usuários.`);
    return users;
  }

  async getOne(id: number) {
    console.log(`[USER SERVICE] Buscando usuário pelo ID: ${id}`);
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      console.warn(`[USER SERVICE] Usuário com ID ${id} não foi encontrado.`);
      throw new NotFoundException('Usuário não encontrado');
    }

    console.log(`[USER SERVICE] Usuário ID ${id} encontrado com sucesso.`);
    return user;
  }

  async create(body: CreateUserDto): Promise<any> {
    console.log(`[USER SERVICE] Tentando criar novo usuário: ${body.name}`);
    const user = this.userRepository.create(body);
    const savedUser = await this.userRepository.save(user);
    console.log(`[USER SERVICE] Usuário criado com sucesso. ID: ${savedUser.id}`);
    return savedUser;
  }

  async update(id: number, body: UpdateUserDto) {
    console.log(`[USER SERVICE] Tentando atualizar usuário ID: ${id}`);
    const user = await this.getOne(id);

    const updateUser = this.userRepository.merge(user, body);
    const savedUser = await this.userRepository.save(updateUser);
    console.log(`[USER SERVICE] Usuário ID ${id} atualizado com sucesso.`);
    return savedUser;
  }

  async delete(id: number) {
    console.log(`[USER SERVICE] Tentando remover usuário ID: ${id}`);
    const user = await this.getOne(id);

    const removedUser = await this.userRepository.remove(user);
    console.log(`[USER SERVICE] Usuário ID ${id} removido com sucesso.`);
    return removedUser;
  }
}
