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
import { EstudanteService } from './estudante.service';
import { CriarEstudanteDto } from './dto/criar-estudante.dto';
import { AtualizarEstudanteDto } from './dto/atualizar-estudante.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadDto } from './dto/upload.dto';

/**
 * O controller EstudanteController vai ser usado para receber e tratar as requisições HTTP de estudantes e uploads,
 * ele pode ser testado com o comando curl -X GET "http://localhost:3007/estudante/all"
 * e vai ser importado em EstudanteModule para mapear as rotas de estudantes da API.
 * 
 * CLI - COMO TESTAR ESTA ROTA VIA TERMINAL:
 * 1. Criar Estudante no MongoDB:
 *    curl -X POST "http://localhost:3007/estudante" -H "Content-Type: application/json" -d "{\"name\":\"Carlos\",\"courseId\":\"60d5ec4b2f2d9c001f8d424b\",\"age\":22}"
 * 
 * 2. Listar todos os estudantes (MongoDB Aggregate):
 *    curl -X GET "http://localhost:3007/estudante/all"
 * 
 * 3. Buscar estudante por ObjectId:
 *    curl -X GET "http://localhost:3007/estudante/60d5ec4b2f2d9c001f8d424b"
 * 
 * 4. Atualizar estudante:
 *    curl -X PATCH "http://localhost:3007/estudante/60d5ec4b2f2d9c001f8d424b" -H "Content-Type: application/json" -d "{\"name\":\"Carlos Souza\"}"
 * 
 * 5. Remover estudante:
 *    curl -X DELETE "http://localhost:3007/estudante/60d5ec4b2f2d9c001f8d424b"
 * 
 * 6. Fazer upload de arquivo (Multipart/Form-Data):
 *    curl -X POST "http://localhost:3007/estudante/upload" -F "file=@caminho/para/imagem.jpg"
 */
@ApiTags('Student')
@Controller('estudante')
export class EstudanteController {
  constructor(private readonly studentService: EstudanteService) {}

  @ApiOperation({ summary: 'Criar um estudante no MongoDB' })
  @Post()
  async create(@Body() createStudentDto: CriarEstudanteDto) {
    console.log('[ESTUDANTE CONTROLLER] Recebida requisição POST /estudante');
    return await this.studentService.create(createStudentDto);
  }

  @ApiOperation({ summary: 'Listar todos os estudantes (MongoDB Aggregate)' })
  @Get('all')
  findAll() {
    console.log('[ESTUDANTE CONTROLLER] Recebida requisição GET /estudante/all');
    return this.studentService.findAll();
  }

  @ApiOperation({ summary: 'Buscar estudante por ID (MongoDB ObjectId)' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(`[ESTUDANTE CONTROLLER] Recebida requisição GET /estudante/${id}`);
    return await this.studentService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar estudante por ID' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: AtualizarEstudanteDto) {
    console.log(`[ESTUDANTE CONTROLLER] Recebida requisição PATCH /estudante/${id}`);
    return await this.studentService.update(id, updateStudentDto);
  }

  @ApiOperation({ summary: 'Deletar estudante por ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log(`[ESTUDANTE CONTROLLER] Recebida requisição DELETE /estudante/${id}`);
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
    console.log('[ESTUDANTE CONTROLLER] Recebida requisição POST /estudante/upload');
    return await this.studentService.upload(file);
  }
}
