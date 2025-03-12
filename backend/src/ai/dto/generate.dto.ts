// ai/dto/generate-content.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class GenerateDto {
  @IsString()
  @IsOptional()
  lastReceivedMessage: string;
  @IsOptional()
  @IsString()
  message: string;
  @IsOptional()
  @IsString()
  allMessages: string[];
  @IsOptional()
  @IsString()
  userName: string;
  @IsOptional()
  @IsString()
  allMyMessages: string[];
}
