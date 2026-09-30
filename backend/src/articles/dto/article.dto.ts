import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsIn, IsInt, IsMongoId, IsOptional, IsString, IsUrl, Length, Max, MaxLength, Min } from 'class-validator';
import { ArticleStatus } from '../schemas/article.schema';

export class CreateArticleDto {
  @ApiProperty() @IsString() @Length(3, 180) title: string;
  @ApiProperty() @IsString() @Length(10, 600) excerpt: string;
  @ApiProperty() @IsString() @Length(20, 100000) content: string;
  @ApiProperty() @IsUrl({ require_tld: false }) @MaxLength(2048) coverImage: string;
  @ApiProperty() @IsString() @Length(3, 300) imageAlt: string;
  @ApiProperty({ enum: ArticleStatus }) @IsOptional() @IsEnum(ArticleStatus) status?: ArticleStatus;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsString() @Length(2, 120) author: string;
  @IsOptional() @IsInt() @Min(1) @Max(180) readingTimeMinutes?: number;
  @IsMongoId() categoryId: string;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
export class ArticleStatusDto { @IsEnum(ArticleStatus) status: ArticleStatus; }
export class FeaturedDto { @IsBoolean() isFeatured: boolean; }
export class ArticleQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 12;
  @IsOptional() @IsString() @MaxLength(100) category?: string;
  @IsOptional() @Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value) @IsString() @MaxLength(120) search?: string;
  @IsOptional() @IsIn(['newest', 'oldest', 'popular']) sort?: 'newest' | 'oldest' | 'popular';
}
