import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { jsonSchemaOptions } from '../../common/mongoose/schema-options';

export const CONTENT_KEYS = ['site.brand', 'site.navigation', 'site.footer', 'site.contact', 'site.profile', 'site.guide', 'site.donation', 'site.search', 'home.page', 'agriculture.page', 'elevage.page', 'humanitaire.page'] as const;
export type ContentKey = typeof CONTENT_KEYS[number];

@Schema({ ...jsonSchemaOptions, timestamps: true })
export class SiteContent {
  @Prop({ required: true, unique: true, enum: CONTENT_KEYS, index: true }) key!: ContentKey;
  @Prop({ required: true, enum: ['site', 'home', 'agriculture', 'elevage', 'humanitaire'], index: true }) section!: string;
  @Prop({ required: true, type: MongooseSchema.Types.Mixed }) data!: Record<string, unknown>;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' }) updatedBy?: string;
}
export type SiteContentDocument = HydratedDocument<SiteContent>;
export const SiteContentSchema = SchemaFactory.createForClass(SiteContent);
