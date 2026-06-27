import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
    private readonly userService: UserService,
  ) {}

  async getAll() {
    const classes = await this.classRepository.find({
      relations: ['user'],
      select: {
        id: true,
        name: true,
        status: true,
        user: {
          id: true,
          name: true,
          status: true,
        },
      },
    });
    return classes;
  }

  async getOne(id: number) {
    const classes = await this.classRepository.findOne({
      where: { id },
    });

    if (!classes) throw new NotFoundException('Classe não encontrado');

    return classes;
  }

  async create(body: CreateClassDto): Promise<CreateClassDto> {
    const user = await this.userService.getOne(body.idUser);

    const newClass = {
      ...body,
      user,
    };

    const classes = this.classRepository.create(newClass);

    const data = await this.classRepository.save(classes);
    return {
      ...data,
      idUser: body.idUser,
    };
  }

  async update(id: number, body: UpdateClassDto) {
    const classes = await this.classRepository.findOne({
      where: { id },
    });

    if (!classes) throw new NotFoundException('Classe não encontrado');

    if (body.idUser) {
      const user = await this.userService.getOne(body.idUser);
      classes.user = user;
    }

    const updateClass = this.classRepository.merge(classes, body);

    return await this.classRepository.save(updateClass);
  }

  async deleteList(ids: number[]) {
    const results = await Promise.all(
      ids.map(async (item) => {
        const classes = await this.classRepository.findOne({
          where: { id: item },
        });

        if (!classes) throw new NotFoundException('Classe não encontrada');

        return await this.classRepository.remove(classes);
      }),
    );

    return {
      deletedItems: results,
    };
  }

  async delete(id: number) {
    const classes = await this.classRepository.findOne({
      where: { id },
    });

    if (!classes) throw new NotFoundException('Classe não encontrada');

    return await this.classRepository.remove(classes);
  }
}
