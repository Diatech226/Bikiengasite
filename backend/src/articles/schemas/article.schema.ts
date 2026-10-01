import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { jsonSchemaOptions } from '../../common/mongoose/schema-options';

export enum ArticleStatus { DRAFT = 'DRAFT', PUBLISHED = 'PUBLISHED' }

@Schema({ collection: 'articles', timestamps: true, ...jsonSchemaOptions })
export class Article {
  @Prop({ required: true, unique: true, trim: true }) slug: string;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) excerpt: string;
  @Prop({ required: true }) content: string;
  @Prop({ required: true }) coverImage: string;
  @Prop({ required: true }) imageAlt: string;
  @Prop({ type: String, enum: ArticleStatus, default: ArticleStatus.DRAFT }) status: ArticleStatus;
  @Prop({ default: false }) isFeatured: boolean;
  @Prop({ required: true }) author: string;
  @Prop({ default: 1, min: 1 }) readingTimeMinutes: number;
  @Prop({ default: 0, min: 0 }) viewsCount: number;
  @Prop({ type: Date }) publishedAt?: Date | null;
  @Prop({ type: Types.ObjectId, ref: Category.name, required: true, index: true }) categoryId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type ArticleDocument = HydratedDocument<Article>;
export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ isFeatured: 1 });
