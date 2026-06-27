import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { DeleteDto } from 'src/common/dto/delete.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  create(@Body() body: CreateClassDto) {
    return this.classService.create(body);
  }

  @Get('all')
  getAll() {
    return this.classService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.classService.getOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: UpdateClassDto) {
    return this.classService.update(id, body);
  }

  @Delete('list')
  deleteList(@Query() query: DeleteDto) {
    return this.classService.deleteList(query.ids);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.classService.delete(id);
  }
}
