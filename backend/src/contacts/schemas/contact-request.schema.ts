import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { jsonSchemaOptions } from '../../common/mongoose/schema-options';

export enum ContactRequestType { DONATION = 'DONATION', FORAGE = 'FORAGE', FOOD_SUPPORT = 'FOOD_SUPPORT', VOLUNTEERING = 'VOLUNTEERING', MATERIAL_SUPPORT = 'MATERIAL_SUPPORT', GENERAL = 'GENERAL' }
export enum ContactRequestStatus { PENDING = 'PENDING', CONTACTED = 'CONTACTED', RESOLVED = 'RESOLVED', CANCELLED = 'CANCELLED' }

@Schema({ collection: 'contactrequests', timestamps: true, ...jsonSchemaOptions })
export class ContactRequest {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) phone: string;
  @Prop() email?: string;
  @Prop({ type: String, enum: ContactRequestType, default: ContactRequestType.GENERAL }) type: ContactRequestType;
  @Prop() message?: string;
  @Prop({ type: String, enum: ContactRequestStatus, default: ContactRequestStatus.PENDING }) status: ContactRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactRequestDocument = HydratedDocument<ContactRequest>;
export const ContactRequestSchema = SchemaFactory.createForClass(ContactRequest);
ContactRequestSchema.index({ status: 1, createdAt: -1 });
ContactRequestSchema.index({ type: 1 });
