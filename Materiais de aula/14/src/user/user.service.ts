import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;
    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
      select: {
        name: true,
        status: true,
      },
    });
    return users;
  }

  async getOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async create(body: CreateUserDto): Promise<CreateUserDto> {
    const newUser = {
      ...body,
    };

    const user = this.userRepository.create(newUser);

    return await this.userRepository.save(user);
  }

  async update(id: number, body: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const updateUser = this.userRepository.merge(user, body);

    return await this.userRepository.save(updateUser);
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return await this.userRepository.remove(user);
  }
}
