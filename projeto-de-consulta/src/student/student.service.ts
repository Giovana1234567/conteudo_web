import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from './entities/student.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * SERVIÇO: StudentService (MongoDB)
 * 
 * Conectividade:
 * - Gerencia a persistência de documentos de Estudantes no MongoDB.
 * - Injeta o repository `MongoRepository<StudentEntity>` associado à conexão 'mongoConnection'.
 * - Oferece lógica para upload de arquivos locais salvos na pasta `/pictures` e servidos estaticamente via NestJS.
 */
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity, 'mongoConnection')
    private readonly studentRepository: MongoRepository<StudentEntity>,
  ) {}

  async create(body: CreateStudentDto): Promise<StudentEntity> {
    console.log(`[STUDENT SERVICE] Criando estudante MongoDB: ${body.name}`);
    const newStudent = this.studentRepository.create(body);
    const saved = await this.studentRepository.save(newStudent);
    console.log(`[STUDENT SERVICE] Estudante criado com sucesso. ID: ${saved._id}`);
    return saved;
  }

  async findAll() {
    console.log('[STUDENT SERVICE] Buscando estudantes com pipeline aggregate (lookup em course)...');
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

      console.log(`[STUDENT SERVICE] Agregação completada. Encontrados ${students.length} estudantes.`);
      return students;
    } catch (error) {
      console.error('[STUDENT SERVICE] Falha ao executar aggregate. Retornando consulta simples find().', error);
      return await this.studentRepository.find();
    }
  }

  async findOne(id: string) {
    console.log(`[STUDENT SERVICE] Buscando estudante MongoDB por ID: ${id}`);
    if (!ObjectId.isValid(id)) {
      console.warn(`[STUDENT SERVICE] Formato de ID inválido: ${id}`);
      throw new NotFoundException('ID do estudante em formato inválido para MongoDB');
    }

    const student = await this.studentRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });

    if (!student) {
      console.warn(`[STUDENT SERVICE] Estudante ID ${id} não encontrado.`);
      throw new NotFoundException('Estudante não encontrado');
    }

    console.log(`[STUDENT SERVICE] Estudante ID ${id} encontrado.`);
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    console.log(`[STUDENT SERVICE] Atualizando dados do estudante ID: ${id}`);
    const student = await this.findOne(id);
    const updated = this.studentRepository.merge(student, updateStudentDto);
    const saved = await this.studentRepository.save(updated);
    console.log(`[STUDENT SERVICE] Estudante ID ${id} atualizado com sucesso.`);
    return saved;
  }

  async remove(id: string) {
    console.log(`[STUDENT SERVICE] Removendo estudante ID: ${id}`);
    const student = await this.findOne(id);
    const removed = await this.studentRepository.remove(student);
    console.log(`[STUDENT SERVICE] Estudante ID ${id} removido com sucesso.`);
    return removed;
  }

  async upload(file: Express.Multer.File) {
    console.log(`[STUDENT SERVICE] Iniciando upload do arquivo: ${file.originalname}`);
    
    // Assegurar que o diretório pictures existe na raiz do projeto
    const uploadDir = path.resolve(process.cwd(), 'pictures');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
    const fileName = `${path.parse(file.originalname).name}_${Date.now()}.${fileExtension}`;
    const fileFullPath = path.join(uploadDir, fileName);

    await fs.writeFile(fileFullPath, file.buffer);
    console.log(`[STUDENT SERVICE] Arquivo salvo em: ${fileFullPath}`);

    // Retorna os dados para disponibilização do link estático no frontend
    return {
      originalname: file.originalname,
      filename: fileName,
      mimetype: file.mimetype,
      size: file.size,
      url: `/img/pictures/${fileName}`,
    };
  }
}
