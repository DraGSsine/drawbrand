// ai/ai.controller.ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { SubscriptionGuard } from 'src/guards/subscription.guard';
import { GenerateDto } from './dto/generate.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  async generateContent(
    @Req() req,
    @Body() generateDto: GenerateDto
  ): Promise<any> {
    return await this.aiService.generate(generateDto, req.user.email);
    
  }
}