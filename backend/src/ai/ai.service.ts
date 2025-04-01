import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios, { AxiosError } from 'axios';
import { User } from 'src/model/UserSchema';
import { GenerateDto } from './dto/generate.dto';
import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';
import { LogoSettings} from 'src/types/interface';

type GeminiModelConfig = {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
};

type ImageGenerationResponse = {
  inlineData?: {
    data: string;
  };
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openRouterApiKey: string;
  private readonly googleGeminiApiKey: string;
  private readonly genAI: GoogleGenerativeAI;
  private readonly DEFAULT_MAX_VARIATIONS = 4;
  private readonly FALLBACK_PROMPT_TEXT = 'My Logo Name';
  private readonly MAX_TEXT_CHARACTERS = 25;

  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.openRouterApiKey = this.getConfigValue('OPENROUTER_API_KEY');
    this.googleGeminiApiKey = this.getConfigValue('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(this.googleGeminiApiKey);
  }

  async generate(data: GenerateDto, userEmail: string): Promise<string[]> {
    try {
      const logoPrompt = await this.generateLogoPrompt(data.sketch, data.prompt, data.settings);
      this.logger.log(`Generated Logo Prompt for ${userEmail}: ${logoPrompt}`);
      
      const logoVariations = await this.generateLogoImages(logoPrompt, data.settings);
      await this.updateUserCredits(userEmail);
      
      return logoVariations.filter(variation => !!variation);
    } catch (error) {
      this.logger.error(`Generation failed for ${userEmail}: ${error.message}`);
      throw new Error(`Logo generation failed: ${error.message}`);
    }
  }

  private getConfigValue(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) throw new Error(`Missing configuration for ${key}`);
    return value;
  }

  private async updateUserCredits(userEmail: string): Promise<void> {
    try {
      const result = await this.userModel.findOneAndUpdate(
        { email: userEmail },
        { $inc: { creditsUsed: 1 } },
        { new: true }
      );
      
      if (!result) {
        this.logger.warn(`User not found for credit update: ${userEmail}`);
      }
    } catch (error) {
      this.logger.error(`Credit update failed for ${userEmail}:`, error);
      throw new Error('Failed to update user credits');
    }
  }

  private processDimensionType(settings?: LogoSettings): string {
    return settings?.styles?.type === 'anything' || !settings?.styles?.type
      ? 'standard vector dimensions'
      : `${settings.styles.type} format`;
  }

  private processStyleValue(settings?: LogoSettings): string {
    const style = settings?.styles?.style;
    return !style || ['anything', 'none'].includes(style)
      ? 'modern minimalist'
      : style.replace('_', ' ');
  }

  private processColorDescription(settings?: LogoSettings): string {
    const colors = settings?.colors;
    if (!colors?.type || colors.type === 'anything' || !colors.color) {
      return 'complementary professional color palette';
    }

    return colors.type === 'solid'
      ? `primary color ${colors.color} with complementary tones`
      : `color palette: ${Array.isArray(colors.color) ? colors.color.join(', ') : colors.color}`;
  }

  private processTextContent(settings?: LogoSettings): string {
    if (!settings?.text?.enabled) return 'none';
    
    const textValue = settings.text.value?.trim() || this.FALLBACK_PROMPT_TEXT;
    return textValue.length > this.MAX_TEXT_CHARACTERS
      ? `${textValue.substring(0, this.MAX_TEXT_CHARACTERS)}...`
      : textValue;
  }

  private async generateLogoPrompt(
    sketch: string,
    userPrompt: string,
    settings: LogoSettings
  ): Promise<string> {
    try {
      this.validateSketch(sketch);
      
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        this.createOpenRouterRequest(userPrompt, sketch),
        this.createOpenRouterHeaders()
      );

      return this.parseOpenRouterResponse(response);
    } catch (error) {
      this.handleOpenRouterError(error);
      return this.createFallbackPrompt(settings, userPrompt);
    }
  }

  private validateSketch(sketch: string): void {
    if (!sketch?.startsWith('data:image')) {
      throw new Error('Invalid sketch format: Expected data URI');
    }
  }

  private createOpenRouterRequest(prompt: string, sketch: string) {
    return {
      model: 'google/gemini-2.5-pro-exp-03-25:free',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: this.buildAnalysisPrompt(prompt) },
          { type: 'image_url', image_url: { url: sketch } }
        ]
      }]
    };
  }

  private buildAnalysisPrompt(userPrompt: string): string {
    return `Analyze this logo sketch and describe it in Imagen prompt format using these sections:
1. Main Subject (primary visual element)
2. Style Keywords (3-5 style descriptors)
3. Color Scheme (primary + secondary colors)
4. Composition Notes (layout, negative space)
5. Technical Requirements (vector, resolution)
    
Context: ${userPrompt}`;
  }

  private createOpenRouterHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.openRouterApiKey}`,
        'HTTP-Referer': 'https://image-generator.app',
        'X-Title': 'Image Generator',
        'Content-Type': 'application/json'
      },
      timeout: 30000
    };
  }

  private parseOpenRouterResponse(response: any): string {
    const content = response.data?.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error('Empty response from OpenRouter');

    return content
      .replace(/^```.*$/gm, '')
      .trim()
      .replace(/^"(.*)"$/s, '$1');
  }

  private handleOpenRouterError(error: AxiosError): void {
    this.logger.error(`OpenRouter API Error: ${error.message}`);
    if (error.response) {
      this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
  }

  private createFallbackPrompt(settings: LogoSettings, userPrompt: string): string {
    return [
      `Main Subject: Abstract brand symbol`,
      `Style: ${this.processStyleValue(settings)}`,
      `Colors: ${this.processColorDescription(settings)}`,
      `Text: "${this.processTextContent(settings)}"`,
      `Technical: Vector format, 8K resolution, transparent background`
    ].join('\n');
  }

  private async generateLogoImages(prompt: string, settings?: LogoSettings): Promise<string[]> {
    const variations: string[] = [];
    
    for (let i = 0; i < this.DEFAULT_MAX_VARIATIONS; i++) {
      try {
        const image = await this.generateSingleImage(prompt, settings);
        if (image) variations.push(image);
      } catch (error) {
        this.logger.error(`Image generation attempt ${i + 1} failed: ${error.message}`);
      }
    }

    if (variations.length === 0) {
      throw new Error('All image generation attempts failed');
    }
    
    return variations;
  }

  private async generateSingleImage(prompt: string, settings?: LogoSettings): Promise<string> {
    const modelConfig = this.getModelConfig(settings);
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
      generationConfig: modelConfig
    });

    const finalPrompt = this.buildImagenPrompt(prompt, settings);
    const response = await model.generateContent(finalPrompt);

    return this.extractImageData(response);
  }

  private buildImagenPrompt(corePrompt: string, settings?: LogoSettings): string {
    const [mainSubject, ...contextParts] = corePrompt.split('\n');
    
    return [
      'Professional logo design brief:',
      `1. Main Subject: ${mainSubject.replace('Main Subject:', '').trim()}`,
      `2. Style: ${this.processStyleValue(settings)}, vector art, 8K resolution`,
      `3. Color Scheme: ${this.processColorDescription(settings)}`,
      `4. Text Content: "${this.processTextContent(settings)}"`,
      `5. Technical Requirements:`,
      `   - SVG vector format`,
      `   - Transparent background`,
      `   - Balanced negative space`,
      `   - Responsive design scaling`,
      `6. Context: ${contextParts.join(' ')}`,
      'Note: Generate 2-3 variations for optimal text integration if needed'
    ].join('\n');
  }

  private getModelConfig(settings?: LogoSettings): GeminiModelConfig {
    return {
      temperature: this.calculateTemperature(settings),
      topP: this.calculateTopP(settings),
      topK: this.calculateTopK(settings),
      maxOutputTokens: 2048
    };
  }

  private calculateTemperature(settings?: LogoSettings): number {
    const creativity = this.parseControlValue(settings?.controls?.creativity, 80);
    return 0.5 + (creativity / 100) * 0.8;
  }

  private calculateTopP(settings?: LogoSettings): number {
    const detail = this.parseControlValue(settings?.controls?.detail, 75);
    return 1 - (detail / 200);
  }

  private calculateTopK(settings?: LogoSettings): number {
    const detail = this.parseControlValue(settings?.controls?.detail, 75);
    return Math.round(32 + (detail / 2));
  }

  private parseControlValue(value: string | number | undefined, defaultValue: number): number {
    if (value === 'anything') return defaultValue;
    const numericValue = Number(value ?? defaultValue);
    return Math.min(Math.max(numericValue, 0), 100);
  }

  private extractImageData(response: any): string {
    const parts = response.response.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error('No content parts in response');

    const imagePart = parts.find((part: ImageGenerationResponse) => part.inlineData);
    if (!imagePart) throw new Error('No image data found in response');

    return imagePart.inlineData.data;
  }
}