import {Module} from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import { TruyenService } from './truyen.service';
import { TruyenController } from './truyen.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Chapter, ChapterSchema} from "./schemas/chapter.schema";
import {Story, StorySchema} from "./schemas/story.schema";
import {Category, CategorySchema} from "./schemas/category.schema";
import {TruyenFullService} from "../services/truyen-full.service";

@Module({
  imports: [
      HttpModule,
      MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
      MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
      MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  controllers: [TruyenController],
  providers: [TruyenService, TruyenFullService]
})
export class TruyenModule {}
