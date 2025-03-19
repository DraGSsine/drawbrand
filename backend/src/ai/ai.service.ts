import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/UserSchema';
import { GenerateDto } from './dto/generate.dto';
import { LogoSettings } from 'src/types/interface';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openRouterApiKey: string;
  private readonly googleGeminiApiKey: string;
  private readonly genAI: any;

  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.openRouterApiKey =
      this.configService.get<string>('OPENROUTER_API_KEY')!;
    this.googleGeminiApiKey = this.configService.get<string>('GEMINI_API_KEY')!;
    this.genAI = new GoogleGenerativeAI(this.googleGeminiApiKey);
  }

  async generate(data: GenerateDto) {
    // Step 1: Analyze sketch and create description
    const sketchDescription = await this.analyzeSketchWithPrompt(
      data.sketch,
      data.prompt,
    );

    // Step 2: Generate logo prompts from description
    const logoPrompts = await this.generateLogoPrompts(
      sketchDescription,
      data.settings,
    );

    // Step 3: Generate actual logos from the prompts
    const generatedLogos = await Promise.all(
      logoPrompts.map((prompt) => this.generateLogo(prompt)),
    );
    console.log('Generated logos:', generatedLogos);
    return generatedLogos;
  }

  async analyzeSketchWithPrompt(
    sketch: string,
    prompt: string,
  ): Promise<string> {
    const result = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.openRouterApiKey}`,
          'HTTP-Referer': '<YOUR_SITE_URL>',
          'X-Title': '<YOUR_SITE_NAME>',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-pro-exp-02-05:free',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this sketch that the user has drawn combined with their concept: "${prompt}". 
                  Create a concise description (maximum 100 words) focusing only on the visual elements, style, and concept. 
                  Don't include any introduction or conclusion, just provide the description.`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: sketch,
                  },
                },
              ],
            },
          ],
        }),
      },
    ).then((res) => res.json());

    return result?.choices[0]?.message?.content || '';
  }

  async generateLogoPrompts(
    sketchDescription: string,
    logoSettings: LogoSettings,
  ): Promise<string[]> {
    const result = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.openRouterApiKey}`,
          'HTTP-Referer': '<YOUR_SITE_URL>',
          'X-Title': '<YOUR_SITE_NAME>',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-pro-exp-02-05:free',
          messages: [
            {
              role: 'user',
              content: `Based on this description: "${sketchDescription}", generate 4 logo prompts.
              Consider these logo settings: ${JSON.stringify(logoSettings)}.
              
              Return ONLY an array of 4 strings in valid JSON format like this: ["prompt1", "prompt2", "prompt3", "prompt4"]
              
              Each prompt should be clear, concise, and detailed enough for an AI image generator to create a logo.
              Do not include any explanations or other text outside the JSON array.`,
            },
          ],
          response_format: { type: 'json_object' },
        }),
      },
    ).then((res) => res.json());

    try {
      const content = result?.choices[0]?.message?.content || '[]';
      // Try to parse as JSON directly
      const parsedContent = JSON.parse(content);
      if (Array.isArray(parsedContent)) {
        return parsedContent;
      }
      // If it's a JSON object with an array property
      if (parsedContent.prompts && Array.isArray(parsedContent.prompts)) {
        return parsedContent.prompts;
      }
      this.logger.warn('Unexpected response format, returning empty array');
      return [];
    } catch (error) {
      this.logger.error('Failed to parse logo prompts', error);
      return [];
    }
  }

  async generateLogo(prompt: string): Promise<string> {
    try {
      // Enhance the prompt for better logo generation
      const enhancedPrompt = `Create a professional logo: ${prompt}. Make it high quality, vector style, clean design, suitable for business use.`;

      // Configure the model for image generation
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp-image-generation',
        generationConfig: {
          responseModalities: ['Text', 'Image'],
        },
      });

      // Generate the image
      const response = await model.generateContent(enhancedPrompt);
      let imageBase64 = '';

      // Extract the base64 image data
      for (const part of response.response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageBase64 = part.inlineData.data;
          break;
        }
      }

      if (!imageBase64) {
        this.logger.warn('No image generated for prompt:', prompt);
      }

      return imageBase64;
    } catch (error) {
      this.logger.error(`Error generating logo for prompt: ${prompt}`, error);
      throw new Error('Failed to generate logo');
    }
  }
}
