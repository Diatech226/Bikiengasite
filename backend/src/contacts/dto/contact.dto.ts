import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';
import { ContactRequestStatus, ContactRequestType } from '../schemas/contact-request.schema';

export class CreateContactDto {
  @IsString() @Length(2, 120) name: string;
  @IsString() @Length(6, 40) phone: string;
  @IsOptional() @IsEmail() @MaxLength(254) email?: string;
  @IsEnum(ContactRequestType) type: ContactRequestType;
  @IsOptional() @IsString() @MaxLength(3000) message?: string;
}
export class ContactQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
  @IsOptional() @IsEnum(ContactRequestStatus) status?: ContactRequestStatus;
  @IsOptional() @IsEnum(ContactRequestType) type?: ContactRequestType;
}
export class ContactStatusDto { @IsEnum(ContactRequestStatus) status: ContactRequestStatus; }
