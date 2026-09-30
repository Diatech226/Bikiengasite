import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { jsonSchemaOptions } from '../../common/mongoose/schema-options';

@Schema({ collection: 'categories', timestamps: true, ...jsonSchemaOptions })
export class Category {
  @Prop({ required: true, unique: true, trim: true }) name: string;
  @Prop({ required: true, unique: true, trim: true }) slug: string;
  @Prop() description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);
