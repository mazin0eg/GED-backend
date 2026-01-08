import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ApplyOpportunityDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  coverLetter?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cvFileId?: number;
}
