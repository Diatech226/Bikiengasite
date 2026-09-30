import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsInt, IsNumber, IsOptional, IsString, Length, Matches, Max, MaxLength, Min } from 'class-validator';
import { DonationStatus } from '../schemas/donation.schema';

export class CreateDonationDto {
  @IsString() @Length(2, 120) donorName: string;
  @IsString() @Length(6, 80) donorContact: string;
  @IsOptional() @IsEmail() @MaxLength(254) donorEmail?: string;
  @IsString() @Matches(/^[a-z0-9_-]{2,40}$/i) type: string;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(999999999) amount?: number;
  @IsOptional() @IsString() @Matches(/^[A-Z]{3}$/) currency?: string;
  @IsOptional() @IsString() @MaxLength(2000) message?: string;
}
export class DonationQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
  @IsOptional() @IsEnum(DonationStatus) status?: DonationStatus;
  @IsOptional() @IsString() @MaxLength(40) type?: string;
  @IsOptional() @IsDateString() from?: string;
  @IsOptional() @IsDateString() to?: string;
}
export class DonationStatusDto { @IsEnum(DonationStatus) status: DonationStatus; }
