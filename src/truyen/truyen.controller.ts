import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TruyenService } from './truyen.service';
import { CreateTruyenDto } from './dto/create-truyen.dto';
import { UpdateTruyenDto } from './dto/update-truyen.dto';
import {CreateStoryDto} from "./dto/create-story.dto";

@Controller('truyen')
export class TruyenController {
  constructor(private readonly truyenService: TruyenService) {}

  @Post()
  create(@Body() createTruyenDto: CreateTruyenDto) {
    return this.truyenService.create(createTruyenDto);
  }

  @Post('/create-story')
  async createStory(@Body() createStoryDto: any) {
    await this.truyenService.createStory(createStoryDto);
  }

  @Get()
  findAll() {
    return this.truyenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.truyenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTruyenDto: UpdateTruyenDto) {
    return this.truyenService.update(+id, updateTruyenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.truyenService.remove(+id);
  }
}
