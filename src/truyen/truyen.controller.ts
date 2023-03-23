import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TruyenService } from './truyen.service';
import { CreateTruyenDto } from './dto/create-truyen.dto';
import { UpdateTruyenDto } from './dto/update-truyen.dto';
import {CreateStoryDto} from "./dto/create-story.dto";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {CreateChapterDto} from "./dto/create-chapter.dto";

@Controller('truyen')
export class TruyenController {
  constructor(private readonly truyenService: TruyenService) {}

  @Post()
  create(@Body() createTruyenDto: CreateTruyenDto) {
    return this.truyenService.create(createTruyenDto);
  }

  @Post('/create-story')
  async createStory(@Body() createStoryDto: CreateStoryDto) {
    await this.truyenService.createStory(createStoryDto);
  }

  @Post('/create-category')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    await this.truyenService.createCategory(createCategoryDto);
  }

  @Post('/create-chapter')
  async createChapter(@Body() createChapterDto: CreateChapterDto) {
    await this.truyenService.createChapter(createChapterDto);
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
