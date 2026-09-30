import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { jsonSchemaOptions } from '../../common/mongoose/schema-options';

export enum DonationStatus { PENDING = 'PENDING', CONTACTED = 'CONTACTED', CONFIRMED = 'CONFIRMED', RECEIVED = 'RECEIVED', CANCELLED = 'CANCELLED' }

@Schema({ collection: 'donations', timestamps: true, ...jsonSchemaOptions })
export class Donation {
  @Prop({ required: true }) donorName: string;
  @Prop({ required: true }) donorContact: string;
  @Prop() donorEmail?: string;
  @Prop({ required: true }) type: string;
  @Prop({ min: 0 }) amount?: number;
  @Prop({ default: 'XOF' }) currency: string;
  @Prop() message?: string;
  @Prop({ type: String, enum: DonationStatus, default: DonationStatus.PENDING }) status: DonationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type DonationDocument = HydratedDocument<Donation>;
export const DonationSchema = SchemaFactory.createForClass(Donation);
DonationSchema.index({ status: 1, createdAt: -1 });
DonationSchema.index({ type: 1 });
