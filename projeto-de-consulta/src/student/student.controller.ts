import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadDto } from './dto/upload.dto';

/**
 * CONTROLADOR: StudentController
 * Expõe endpoints HTTP para gerenciar estudantes (MongoDB) e upload de arquivos locais.
 * 
 * Conectividade:
 * - Injeta o `StudentService` para persistência e processamento de imagens com Multer.
 * - Registrado no `StudentModule`.
 * 
 * CLI - COMO TESTAR ESTA ROTA VIA TERMINAL:
 * 1. Criar Estudante no MongoDB:
 *    curl -X POST "http://localhost:3007/student" -H "Content-Type: application/json" -d "{\"name\":\"Carlos\",\"courseId\":\"60d5ec4b2f2d9c001f8d424b\",\"age\":22}"
 * 
 * 2. Listar todos os estudantes (Aggregate + Lookup):
 *    curl -X GET "http://localhost:3007/student/all"
 * 
 * 3. Buscar estudante por ObjectId:
 *    curl -X GET "http://localhost:3007/student/60d5ec4b2f2d9c001f8d424b"
 * 
 * 4. Atualizar estudante:
 *    curl -X PATCH "http://localhost:3007/student/60d5ec4b2f2d9c001f8d424b" -H "Content-Type: application/json" -d "{\"name\":\"Carlos Souza\"}"
 * 
 * 5. Remover estudante:
 *    curl -X DELETE "http://localhost:3007/student/60d5ec4b2f2d9c001f8d424b"
 * 
 * 6. Fazer upload de arquivo (Multipart/Form-Data):
 *    curl -X POST "http://localhost:3007/student/upload" -F "file=@caminho/para/imagem.jpg"
 */
@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: 'Criar um estudante no MongoDB' })
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    console.log('[STUDENT CONTROLLER] Recebida requisição POST /student');
    return await this.studentService.create(createStudentDto);
  }

  @ApiOperation({ summary: 'Listar todos os estudantes (MongoDB Aggregate)' })
  @Get('all')
  findAll() {
    console.log('[STUDENT CONTROLLER] Recebida requisição GET /student/all');
    return this.studentService.findAll();
  }

  @ApiOperation({ summary: 'Buscar estudante por ID (MongoDB ObjectId)' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(`[STUDENT CONTROLLER] Recebida requisição GET /student/${id}`);
    return await this.studentService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar estudante por ID' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    console.log(`[STUDENT CONTROLLER] Recebida requisição PATCH /student/${id}`);
    return await this.studentService.update(id, updateStudentDto);
  }

  @ApiOperation({ summary: 'Deletar estudante por ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log(`[STUDENT CONTROLLER] Recebida requisição DELETE /student/${id}`);
    return await this.studentService.remove(id);
  }

  @ApiOperation({ summary: 'Upload de arquivo (salva na pasta pictures local)' })
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.log('[STUDENT CONTROLLER] Recebida requisição POST /student/upload');
    return await this.studentService.upload(file);
  }
}
