
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StoryDocument = HydratedDocument<Story>;

@Schema()
export class Story {
    @Prop({unique: true, required: true})
    title: string;

    @Prop()
    author: string;


    @Prop([String])
    description: string[];

    @Prop()
    poster: string;

    @Prop([String])
    categoryList: string[];

    @Prop()
    status: string;
}

export const StorySchema = SchemaFactory.createForClass(Story);