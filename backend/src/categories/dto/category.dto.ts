import { PartialType } from '@nestjs/swagger'; import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
export class CreateCategoryDto { @IsString() @Length(2,80) name:string; @IsOptional() @IsString() @MaxLength(500) description?:string; }
export class UpdateCategoryDto extends PartialType(CreateCategoryDto){}
