import { Injectable, NotFoundException } from '@nestjs/common';
import { CriarAulaDto } from './dto/criar-aula.dto';
import { AtualizarAulaDto } from './dto/atualizar-aula.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AulaEntity } from './entities/aula.entity';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';

/**
 * O service AulaService vai ser usado para realizar as operações de CRUD de aulas e gerenciar o relacionamento com usuários,
 * ele pode ser testado com o endpoint GET /aula/all
 * e vai ser importado em AulaController para retornar as aulas e suas associações.
 */
@Injectable()
export class AulaService {
  constructor(
    @InjectRepository(AulaEntity)
    private readonly classRepository: Repository<AulaEntity>,
    private readonly userService: UsuarioService,
  ) {}

  async getAll() {
    console.log('[AULA SERVICE] Buscando todas as aulas e seus usuários relacionados...');
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
    console.log(`[AULA SERVICE] Encontradas ${classes.length} aulas.`);
    return classes;
  }

  async getOne(id: number) {
    console.log(`[AULA SERVICE] Buscando aula ID: ${id}`);
    const classes = await this.classRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!classes) {
      console.warn(`[AULA SERVICE] Aula ID ${id} não encontrada.`);
      throw new NotFoundException('Classe não encontrada');
    }

    console.log(`[AULA SERVICE] Aula ID ${id} encontrada com sucesso.`);
    return classes;
  }

  async create(body: CriarAulaDto): Promise<any> {
    console.log(`[AULA SERVICE] Criando aula "${body.name}" vinculada ao usuário ID: ${body.idUser}`);
    const user = await this.userService.getOne(body.idUser);

    const newClass = {
      ...body,
      user,
    };

    const classes = this.classRepository.create(newClass);
    const data = await this.classRepository.save(classes);
    console.log(`[AULA SERVICE] Aula criada com sucesso. ID: ${data.id}`);
    
    return {
      ...data,
      idUser: body.idUser,
    };
  }

  async update(id: number, body: AtualizarAulaDto) {
    console.log(`[AULA SERVICE] Atualizando aula ID: ${id}`);
    const classes = await this.getOne(id);

    if (body.idUser) {
      console.log(`[AULA SERVICE] Atualizando FK da aula para Usuário ID: ${body.idUser}`);
      const user = await this.userService.getOne(body.idUser);
      classes.user = user;
    }

    const updateClass = this.classRepository.merge(classes, body);
    const saved = await this.classRepository.save(updateClass);
    console.log(`[AULA SERVICE] Aula ID ${id} atualizada com sucesso.`);
    return saved;
  }

  async deleteList(ids: number[]) {
    console.log(`[AULA SERVICE] Removendo em lote para IDs: [${ids.join(', ')}]`);
    const results = await Promise.all(
      ids.map(async (item) => {
        const classes = await this.classRepository.findOne({
          where: { id: item },
        });

        if (!classes) {
          console.warn(`[AULA SERVICE] Aula ID ${item} não encontrada no lote.`);
          throw new NotFoundException(`Classe ID ${item} não encontrada`);
        }

        return await this.classRepository.remove(classes);
      }),
    );

    console.log(`[AULA SERVICE] Deleção em lote concluída para ${results.length} itens.`);
    return {
      deletedItems: results,
    };
  }

  async delete(id: number) {
    console.log(`[AULA SERVICE] Deletando aula ID: ${id}`);
    const classes = await this.getOne(id);
    const removed = await this.classRepository.remove(classes);
    console.log(`[AULA SERVICE] Aula ID ${id} removida com sucesso.`);
    return removed;
  }
}
