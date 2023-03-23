import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TruyenService } from './truyen.service';
import { CreateTruyenDto } from './dto/create-truyen.dto';
import { UpdateTruyenDto } from './dto/update-truyen.dto';
import {CreateStoryDto} from "./dto/create-story.dto";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {CreateChapterDto} from "./dto/create-chapter.dto";
import {TruyenFullService} from "../services/truyen-full.service";
import {Story, StorySchema} from "./schemas/story.schema";

@Controller('truyen')
export class TruyenController {
  constructor(
      private readonly truyenService: TruyenService,
      private readonly truyenFullService: TruyenFullService
  ) {}

  @Post()
  create(@Body() createTruyenDto: CreateTruyenDto) {
    return this.truyenService.create(createTruyenDto);
  }

  //region create
  @Post('/create-story')
  async createStory(@Body() createStoryDto: CreateStoryDto) {
    let newStory : Story = {
      title: createStoryDto.title,
      author: createStoryDto.author,
      description: createStoryDto.description,
      poster: createStoryDto.poster,
      categoryList: createStoryDto.categoryList,
      status: createStoryDto.status,
    };
    await this.truyenService.createStory(newStory);
  }

  @Post('/create-category')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    await this.truyenService.createCategory(createCategoryDto);
  }

  @Post('/create-chapter')
  async createChapter(@Body() createChapterDto: CreateChapterDto) {
    await this.truyenService.createChapter(createChapterDto);
  }
  //endregion

  @Get('/crawlStoryByCategory')
  async crawlStoryByCategory() {
    const stories = await this.truyenFullService.crawl1PageOfCategory('kiem-hiep', 2);

    for (const story of stories) {
      if(story == null){
        continue;
      }
      let newStory : Story = {
        title: story.title,
        author: story.author,
        description: story.description,
        poster: story.poster,
        categoryList: story.categoryList,
        status: story.status,
      };
      try {
        await this.truyenService.createStory(newStory)
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error, handle it appropriately
          console.log('Skipping duplicate key error');
          continue;
        } else {
          // Other error, re-throw it
          throw error;
        }
      }

    }
    return 'done';
  }

  @Get('/getStoryInfo')
  async getStoryInfo(@Body() body: any){
    const story = await this.truyenFullService.crawlStoryInfo(body.url);
    return story;
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
