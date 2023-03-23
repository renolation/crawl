
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChapterDocument = HydratedDocument<Chapter>;

@Schema()
export class Chapter {
    @Prop({unique: true, required: true})
    header: string;

    @Prop({ type:  mongoose.Schema.Types.ObjectId, ref: 'Story', required: true })
    fromStory: string;


    @Prop({ required: true })
    body: any[];
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);