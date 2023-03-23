import { Module } from '@nestjs/common';
import { TruyenService } from './truyen.service';
import { TruyenController } from './truyen.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Chapter, ChapterSchema} from "./schemas/chapter.schema";
import {Story, StorySchema} from "./schemas/story.schema";

@Module({
  imports: [
      MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }]),
      MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }]),
  ],
  controllers: [TruyenController],
  providers: [TruyenService]
})
export class TruyenModule {}
