import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsObject, IsOptional, IsString, IsUrl, Length, Max, MaxLength, Min, ValidateNested } from 'class-validator';

export class UpdateContentDto {
  @IsObject() data!: Record<string, unknown>;
}

export class MediaMetadataDto {
  @IsOptional() @IsString() @MaxLength(80) duration?: string;
  @IsOptional() @IsString() @MaxLength(120) category?: string;
  @IsOptional() @IsString() @MaxLength(80) tagIcon?: string;
  @IsOptional() @IsString() @MaxLength(80) badgeIcon?: string;
  @IsOptional() @IsString() @MaxLength(80) statsIcon?: string;
  @IsOptional() @IsString() @MaxLength(160) location?: string;
  @IsOptional() @IsString() @MaxLength(120) statusText?: string;
  @IsOptional() @IsString() @MaxLength(12000) expandedNarrative?: string;
  @IsOptional() @IsString() @MaxLength(1500) impactBox?: string;
}

export class MediaItemDto {
  @IsString() @Length(2, 120) slug!: string;
  @IsIn(['home', 'agriculture', 'elevage', 'humanitaire']) section!: string;
  @IsIn(['reportage', 'chronique', 'projet']) type!: string;
  @IsString() @Length(2, 180) title!: string;
  @IsString() @Length(2, 1500) description!: string;
  @IsOptional() @IsString() @MaxLength(12000) body?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(2048) imageUrl?: string;
  @IsOptional() @IsString() @MaxLength(240) imageAlt?: string;
  @IsOptional() @IsString() @MaxLength(80) badge?: string;
  @IsOptional() @IsString() @MaxLength(80) dateLabel?: string;
  @IsOptional() @IsString() @MaxLength(80) metric?: string;
  @IsOptional() @IsString() @MaxLength(60) buttonLabel?: string;
  @IsOptional() @ValidateNested() @Type(() => MediaMetadataDto) metadata?: MediaMetadataDto;
  @IsInt() @Min(0) @Max(10000) @Type(() => Number) order!: number;
  @IsBoolean() @Transform(({ value }) => value === true || value === 'true') isActive!: boolean;
}
