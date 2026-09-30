import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { jsonSchemaOptions } from '../../common/mongoose/schema-options';

export enum UserRole { ADMIN = 'ADMIN' }

@Schema({ collection: 'users', timestamps: true, ...jsonSchemaOptions })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true }) email: string;
  @Prop({ required: true, select: false }) passwordHash: string;
  @Prop() firstName?: string;
  @Prop() lastName?: string;
  @Prop({ type: String, enum: UserRole, default: UserRole.ADMIN }) role: UserRole;
  @Prop({ default: true }) isActive: boolean;
  @Prop({ select: false }) refreshTokenHash?: string;
  @Prop({ select: false }) refreshTokenJti?: string;
  @Prop() lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
