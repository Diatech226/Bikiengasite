import{ContactRequestStatus,ContactRequestType}from'@prisma/client';import{IsEmail,IsEnum,IsOptional,IsString,Length,MaxLength}from'class-validator';
export class CreateContactDto{@IsString()@Length(2,120)name:string;@IsString()@Length(6,40)phone:string;@IsOptional()@IsEmail()@MaxLength(254)email?:string;@IsEnum(ContactRequestType)type:ContactRequestType;@IsOptional()@IsString()@MaxLength(3000)message?:string}
export class ContactQueryDto{@IsOptional()@IsEnum(ContactRequestStatus)status?:ContactRequestStatus;@IsOptional()@IsEnum(ContactRequestType)type?:ContactRequestType}
export class ContactStatusDto{@IsEnum(ContactRequestStatus)status:ContactRequestStatus}
