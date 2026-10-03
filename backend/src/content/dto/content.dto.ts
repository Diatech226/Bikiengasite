import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsObject, IsOptional, IsString, IsUrl, Length, Matches, Max, MaxLength, Min, ValidateNested } from 'class-validator';

const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value;

export class UpdateContentDto {
  @IsObject() data!: Record<string, unknown>;
}

export class MediaMetadataDto {
  @IsOptional() @Transform(trim) @IsString() @MaxLength(80) duration?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(120) category?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(80) tagIcon?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(80) badgeIcon?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(80) statsIcon?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(160) location?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(120) statusText?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(12000) expandedNarrative?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(1500) impactBox?: string;
}

export class MediaItemDto {
  @IsOptional() @Transform(trim) @IsString() @Length(2, 120) @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) slug?: string;
  @IsIn(['home', 'agriculture', 'elevage', 'humanitaire']) section!: string;
  @IsIn(['reportage', 'chronique', 'projet']) type!: string;
  @Transform(trim) @IsString() @Length(2, 180) title!: string;
  @Transform(trim) @IsString() @Length(2, 1500) description!: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(12000) body?: string;
  @IsOptional() @Transform(trim) @IsUrl({ require_protocol: true, protocols: ['http', 'https'] }) @MaxLength(2048) imageUrl?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(240) imageAlt?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(80) badge?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(80) dateLabel?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(80) metric?: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(60) buttonLabel?: string;
  @IsOptional() @ValidateNested() @Type(() => MediaMetadataDto) metadata?: MediaMetadataDto;
  @IsInt() @Min(0) @Max(10000) @Type(() => Number) order!: number;
  @IsBoolean() @Transform(({ value }) => value === true || value === 'true') isActive!: boolean;
}
