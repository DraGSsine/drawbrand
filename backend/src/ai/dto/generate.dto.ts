// ai/dto/generate-content.dto.ts
import { IsString, IsOptional } from 'class-validator';
import {LogoSettings} from '../../types/interface';

export class GenerateDto {
  @IsString()
  prompt: string;

  @IsOptional()
  settings: LogoSettings;

  @IsOptional()
  sketch: any;

  @IsOptional()
  @IsString()
  timestamp?: string;
}
