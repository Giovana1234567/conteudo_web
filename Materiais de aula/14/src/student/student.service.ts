import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from './entities/student.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity, 'mongoConnection')
    private readonly studentRepository: MongoRepository<StudentEntity>, // Diferente no MongoDB
  ){}

  async create(body: CreateStudentDto): Promise<StudentEntity> {
    const newStudent = {
      ...body,
    };

    const student = this.studentRepository.create(newStudent);

    return await this.studentRepository.save(student);
  }

  async findAll() {
    const students = await this.studentRepository.aggregate([
      {
        $lookup: {
          from: 'course_entity',
          localField: 'courseId',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: '$course' },
    ]).toArray(); // Caso retorne apenas 1 item trocar para next()

    return students;
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne({
      where: {
        _id: new ObjectId(id), // Diferente no MongoDB
       },
    });
    
    if (!student) throw new NotFoundException('Estudante não encontrado');
    
    return student;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }

  async upload(file: Express.Multer.File) {
    const fileExtesion = path.extname(file.originalname).toLocaleLowerCase().substring(1);
    const fileName = `${path.parse(file.originalname).name}_${Date.now()}.${fileExtesion}`;
    const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

    await fs.writeFile(fileFullPath, file.buffer);

    return file;
  }
}
