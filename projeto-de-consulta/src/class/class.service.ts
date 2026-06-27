import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

/**
 * SERVIÇO: ClassService (PostgreSQL)
 * 
 * Conectividade:
 * - Gerencia a persistência de aulas/classes no PostgreSQL.
 * - Depende de `UserService` para verificar a existência do Usuário associado (FK `user_id`) antes de criar/atualizar aulas.
 * - Registrado no `ClassModule` (que importa o `UserModule` para poder injetar `UserService`).
 * - Injeta o repository `Repository<ClassEntity>` via `TypeOrmModule.forFeature([ClassEntity])`.
 */
@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
    private readonly userService: UserService, // Conectividade com UserModule para validação de FK
  ) {}

  async getAll() {
    console.log('[CLASS SERVICE] Buscando todas as classes e suas relações de usuários...');
    const classes = await this.classRepository.find({
      relations: ['user'], // Traz a relação FK do Usuário
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
    console.log(`[CLASS SERVICE] Retornando ${classes.length} classes.`);
    return classes;
  }

  async getOne(id: number) {
    console.log(`[CLASS SERVICE] Buscando classe específica pelo ID: ${id}`);
    const classes = await this.classRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!classes) {
      console.warn(`[CLASS SERVICE] Classe ID ${id} não encontrada.`);
      throw new NotFoundException('Classe não encontrada');
    }

    console.log(`[CLASS SERVICE] Classe ID ${id} encontrada com sucesso.`);
    return classes;
  }

  async create(body: CreateClassDto): Promise<any> {
    console.log(`[CLASS SERVICE] Criando classe "${body.name}" associada ao usuário ID: ${body.idUser}`);
    
    // Conectividade: Valida se o usuário estrangeiro existe antes de associar a FK
    const user = await this.userService.getOne(body.idUser);

    const newClass = {
      ...body,
      user,
    };

    const classes = this.classRepository.create(newClass);
    const savedClass = await this.classRepository.save(classes);
    console.log(`[CLASS SERVICE] Classe criada com sucesso. ID: ${savedClass.id}`);
    
    return {
      ...savedClass,
      idUser: body.idUser,
    };
  }

  async update(id: number, body: UpdateClassDto) {
    console.log(`[CLASS SERVICE] Atualizando classe ID: ${id}`);
    const classes = await this.getOne(id);

    if (body.idUser) {
      console.log(`[CLASS SERVICE] Atualizando FK da classe para Usuário ID: ${body.idUser}`);
      const user = await this.userService.getOne(body.idUser);
      classes.user = user;
    }

    const updateClass = this.classRepository.merge(classes, body);
    const savedClass = await this.classRepository.save(updateClass);
    console.log(`[CLASS SERVICE] Classe ID ${id} atualizada com sucesso.`);
    return savedClass;
  }

  async deleteList(ids: number[]) {
    console.log(`[CLASS SERVICE] Remoção em lote de classes iniciada para IDs: [${ids.join(', ')}]`);
    const results = await Promise.all(
      ids.map(async (item) => {
        const classes = await this.classRepository.findOne({
          where: { id: item },
        });

        if (!classes) {
          console.warn(`[CLASS SERVICE] Classe ID ${item} não encontrada na deleção em lote.`);
          throw new NotFoundException(`Classe ID ${item} não encontrada`);
        }

        return await this.classRepository.remove(classes);
      }),
    );

    console.log(`[CLASS SERVICE] Deleção em lote concluída para ${results.length} itens.`);
    return {
      deletedItems: results,
    };
  }

  async delete(id: number) {
    console.log(`[CLASS SERVICE] Deletando classe ID: ${id}`);
    const classes = await this.getOne(id);
    const removedClass = await this.classRepository.remove(classes);
    console.log(`[CLASS SERVICE] Classe ID ${id} removida do PostgreSQL.`);
    return removedClass;
  }
}
