import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Query,
} from '@nestjs/common';
import { TruyenService } from './truyen.service';
import { CreateTruyenDto } from './dto/create-truyen.dto';
import { UpdateTruyenDto } from './dto/update-truyen.dto';
import { CreateStoryDto } from './dto/create-story.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { TruyenFullService } from '../services/truyen-full.service';
import { Story, StorySchema } from './schemas/story.schema';
import axios from 'axios';
import { axiosParams, sleep } from '../core/helper';
import { Chapter } from './schemas/chapter.schema';
import {ApiQuery} from "@nestjs/swagger";

@Controller('truyen')
export class TruyenController {
  constructor(
    private readonly truyenService: TruyenService,
    private readonly truyenFullService: TruyenFullService,
  ) {}

  @Post()
  create(@Body() createTruyenDto: CreateTruyenDto) {
    return this.truyenService.create(createTruyenDto);
  }

  //region create
  @Post('/create-story')
  async createStory(@Body() createStoryDto: CreateStoryDto) {
    let newStory: Story = {
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
    const stories = await this.truyenFullService.crawl1PageOfCategory(
      'kiem-hiep',
      2,
    );

    for (const story of stories) {
      if (story == null) {
        continue;
      }
      let newStory: Story = {
        title: story.title,
        author: story.author,
        description: story.description,
        poster: story.poster,
        categoryList: story.categoryList,
        status: story.status,
      };
      try {
        await this.truyenService.createStory(newStory);
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
  async getStoryInfo(@Body() body: any) {
    const story = await this.truyenFullService.crawlStoryInfo(body.url);
    return story;
  }

  @Get()
  async findAll() {
    const response = await axios.get(
      'https://httpbin.org/headers',
      axiosParams,
    );
    console.log(response.data);
  }

  @Get('/get-last-chapter')
  @ApiQuery({ name: 'title' })
  async getLastChapter(
      @Query('title') title: string,
  ) {
    const response = await this.truyenFullService.getLastChapterIndexStory(
      title,
    );
    return response;
  }

  @Get('/get-all-chapter')
  async getAllChapter(@Body() body: any)
  {
    const lastChapter = await this.truyenFullService.getLastChapterIndexStory(
      body.title,
    );
    console.log(`chapter: ${lastChapter}`);
    for (let i = 1; i <= Number(lastChapter); i++) {
      let chapter = await this.truyenFullService.crawl1Chapter(body.title, i);

      // if (i % 3 == 0) {
      await sleep(1200);
      // }

      if (chapter == null) {
        break;
      } else {
        let newChapter: Chapter = {
          header: chapter.header,
          fromStory: body.title,
          body: chapter.body,
        };

        try {
          await this.truyenService.createChapter(newChapter);
        } catch (error) {
          if (error.code === 11000) {
            // Duplicate key error, handle it appropriately
            console.log('Skipping duplicate key error');

          } else {
            // Other error, re-throw it
            throw error;
          }
          continue;
        }
      }
    }
    return 'done';
  }

  @Get('/get-all-chapter-new')
  @ApiQuery({ name: 'title' })
  async getAllChapterNew(
      @Query('title') title: string,
  )
  {
    console.log(title);
    let firstChapterUrl= await  this.truyenFullService.getUrlChapter1(title);

    let chapterData = await this.truyenFullService.crawl1ChapterNew(firstChapterUrl);
    console.log(chapterData);
    //insert database
    let newChapter: Chapter = {
      header: chapterData.header,
      fromStory: title,
      body: chapterData.body,
    };
    await this.insertChapter(newChapter);
    while(chapterData.urlNextChapter != 'javascript:void(0)'){
      console.log('insert data');
       chapterData = await this.truyenFullService.crawl1ChapterNew(chapterData.urlNextChapter);
      //insert database

      let newChapter: Chapter = {
        header: chapterData.header,
        fromStory: title,
        body: chapterData.body,
      };
      await this.insertChapter(newChapter);

    }
  }
  async insertChapter(chapter: Chapter){


    try {
      await this.truyenService.createChapter(chapter);
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error, handle it appropriately
        console.log('Skipping duplicate key error');

      } else {
        // Other error, re-throw it
        throw error;
      }

    }
  }

  @Get('/get-all-story-by-category')
  async getAllStoryByCategory(@Body() body: any) {
    // return await this.truyenFullService.getLastPageIndexCategory(body.category);
    let crawlResult = await this.truyenFullService.crawlAllPagesOfCategory(body.category);
    for (const story of crawlResult) {
      // const newStory = new Story({
      //   "title": story.title,
      //   "author": story.author,
      //   "description": story.description,
      //   "poster": story.poster,
      //   "categoryList": story.categoryList,
      //   "status": story.status,
      // });

      let newStory: Story = {
        "title": story.title,
        "author": story.author,
        "description": story.description,
        "poster": story.poster,
        "categoryList": story.categoryList,
        "status": story.status,
      };

      try {
        await this.truyenService.createStory(newStory);
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

    return `done ${crawlResult.length}`;

  }


  @Get('/get-all-category')
    async getAllCategory(){
      return this.truyenFullService.crawlCategoryList();
  }

  @Get('/get-1-chapter')
  async get1Chapter(@Body() body: any) {
    let chapter = await this.truyenFullService.crawl1Chapter(body.title, body.chapter);
    return `${chapter.body}`;

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
