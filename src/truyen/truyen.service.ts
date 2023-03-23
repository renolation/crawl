import { Injectable } from '@nestjs/common';
import { CreateTruyenDto } from './dto/create-truyen.dto';
import { UpdateTruyenDto } from './dto/update-truyen.dto';
import {Chapter, ChapterDocument} from "./schemas/chapter.schema";
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {CreateStoryDto} from "./dto/create-story.dto";
import {Story, StoryDocument} from "./schemas/story.schema";

@Injectable()
export class TruyenService {

  constructor(
      @InjectModel(Chapter.name) private chapterModel: Model<ChapterDocument>,
      @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
      @InjectConnection() private connection: Connection
  ) {}
  create(createTruyenDto: CreateTruyenDto) {
    return 'This action adds a new truyen';
  }

  async createStory(createStoryDto: CreateStoryDto): Promise<Story> {
    const createdStory = await this.storyModel.create(createStoryDto);
    return createdStory;
  }

  findAll() {
    return `This action returns all truyen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} truyen`;
  }

  update(id: number, updateTruyenDto: UpdateTruyenDto) {
    return `This action updates a #${id} truyen`;
  }

  remove(id: number) {
    return `This action removes a #${id} truyen`;
  }
}
