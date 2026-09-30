import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { jsonSchemaOptions } from '../../common/mongoose/schema-options';

@Schema({ ...jsonSchemaOptions, timestamps: true })
export class MediaItem {
  @Prop({ required: true, unique: true, trim: true, maxlength: 120 }) slug!: string;
  @Prop({ required: true, enum: ['home', 'agriculture', 'elevage', 'humanitaire'], index: true }) section!: string;
  @Prop({ required: true, enum: ['reportage', 'chronique', 'projet'] }) type!: string;
  @Prop({ required: true, trim: true, maxlength: 180 }) title!: string;
  @Prop({ required: true, trim: true, maxlength: 1500 }) description!: string;
  @Prop({ trim: true, maxlength: 12000 }) body?: string;
  @Prop({ trim: true, maxlength: 2048 }) imageUrl?: string;
  @Prop({ trim: true, maxlength: 240 }) imageAlt?: string;
  @Prop({ trim: true, maxlength: 80 }) badge?: string;
  @Prop({ trim: true, maxlength: 80 }) dateLabel?: string;
  @Prop({ trim: true, maxlength: 80 }) metric?: string;
  @Prop({ trim: true, maxlength: 60 }) buttonLabel?: string;
  @Prop({ type: MongooseSchema.Types.Mixed, default: {} }) metadata!: Record<string, string>;
  @Prop({ required: true, min: 0, max: 10000, default: 0 }) order!: number;
  @Prop({ required: true, default: true, index: true }) isActive!: boolean;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' }) updatedBy?: string;
}
export type MediaItemDocument = HydratedDocument<MediaItem>;
export const MediaItemSchema = SchemaFactory.createForClass(MediaItem);
