import { Injectable, NotFoundException } from '@nestjs/common';
import { CriarEstudanteDto } from './dto/criar-estudante.dto';
import { AtualizarEstudanteDto } from './dto/atualizar-estudante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EstudanteEntity } from './entities/estudante.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * O service EstudanteService vai ser usado para realizar as operações de CRUD de estudantes no MongoDB e upload de arquivos,
 * ele pode ser testado com o endpoint GET /estudante/all
 * e vai ser importado em EstudanteController para retornar buscas e realizar as operações no banco de dados e arquivos.
 */
@Injectable()
export class EstudanteService {
  constructor(
    @InjectRepository(EstudanteEntity, 'mongoConnection')
    private readonly studentRepository: MongoRepository<EstudanteEntity>,
  ) {}

  async create(body: CriarEstudanteDto): Promise<EstudanteEntity> {
    console.log(`[ESTUDANTE SERVICE] Criando estudante MongoDB: ${body.name}`);
    const newStudent = this.studentRepository.create(body);
    const saved = await this.studentRepository.save(newStudent);
    console.log(`[ESTUDANTE SERVICE] Estudante criado com sucesso. ID: ${saved._id}`);
    return saved;
  }

  async findAll() {
    console.log('[ESTUDANTE SERVICE] Buscando estudantes com pipeline aggregate...');
    try {
      const students = await this.studentRepository.aggregate([
        {
          $lookup: {
            from: 'course_entity',
            localField: 'courseId',
            foreignField: '_id',
            as: 'course',
          },
        },
        { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
      ]).toArray();

      console.log(`[ESTUDANTE SERVICE] Agregação completada. Encontrados ${students.length} estudantes.`);
      return students;
    } catch (error) {
      console.error('[ESTUDANTE SERVICE] Falha ao executar aggregate. Retornando consulta simples find().', error);
      return await this.studentRepository.find();
    }
  }

  async findOne(id: string) {
    console.log(`[ESTUDANTE SERVICE] Buscando estudante MongoDB por ID: ${id}`);
    if (!ObjectId.isValid(id)) {
      console.warn(`[ESTUDANTE SERVICE] Formato de ID inválido: ${id}`);
      throw new NotFoundException('ID do estudante em formato inválido para MongoDB');
    }

    const student = await this.studentRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });

    if (!student) {
      console.warn(`[ESTUDANTE SERVICE] Estudante ID ${id} não encontrado.`);
      throw new NotFoundException('Estudante não encontrado');
    }

    console.log(`[ESTUDANTE SERVICE] Estudante ID ${id} encontrado.`);
    return student;
  }

  async update(id: string, updateStudentDto: AtualizarEstudanteDto) {
    console.log(`[ESTUDANTE SERVICE] Atualizando dados do estudante ID: ${id}`);
    const student = await this.findOne(id);
    const updated = this.studentRepository.merge(student, updateStudentDto);
    const saved = await this.studentRepository.save(updated);
    console.log(`[ESTUDANTE SERVICE] Estudante ID ${id} atualizado com sucesso.`);
    return saved;
  }

  async remove(id: string) {
    console.log(`[ESTUDANTE SERVICE] Removendo estudante ID: ${id}`);
    const student = await this.findOne(id);
    const removed = await this.studentRepository.remove(student);
    console.log(`[ESTUDANTE SERVICE] Estudante ID ${id} removido com sucesso.`);
    return removed;
  }

  async upload(file: Express.Multer.File) {
    console.log(`[ESTUDANTE SERVICE] Iniciando upload do arquivo: ${file.originalname}`);
    const uploadDir = path.resolve(process.cwd(), 'pictures');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
    const fileName = `${path.parse(file.originalname).name}_${Date.now()}.${fileExtension}`;
    const fileFullPath = path.join(uploadDir, fileName);

    await fs.writeFile(fileFullPath, file.buffer);
    console.log(`[ESTUDANTE SERVICE] Arquivo salvo em: ${fileFullPath}`);

    return {
      originalname: file.originalname,
      filename: fileName,
      mimetype: file.mimetype,
      size: file.size,
      url: `/img/pictures/${fileName}`,
    };
  }
}
