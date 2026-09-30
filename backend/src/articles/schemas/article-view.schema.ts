import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { jsonSchemaOptions } from '../../common/mongoose/schema-options';
import { Article } from './article.schema';

@Schema({ collection: 'articleviews', timestamps: { createdAt: true, updatedAt: false }, ...jsonSchemaOptions })
export class ArticleView {
  @Prop({ type: Types.ObjectId, ref: Article.name, required: true }) articleId: Types.ObjectId;
  @Prop({ required: true }) visitorHash: string;
  @Prop({ required: true }) bucket: Date;
  createdAt: Date;
}

export type ArticleViewDocument = HydratedDocument<ArticleView>;
export const ArticleViewSchema = SchemaFactory.createForClass(ArticleView);
ArticleViewSchema.index({ articleId: 1, visitorHash: 1, bucket: 1 }, { unique: true });
ArticleViewSchema.index({ createdAt: 1 });
