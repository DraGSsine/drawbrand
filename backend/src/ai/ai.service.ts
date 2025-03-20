import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/UserSchema';
import { GenerateDto } from './dto/generate.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LogoSettings } from 'src/types/interface';

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
    // Step 1: Extract the core intent and subject matter from the sketch and prompt
    const conceptIdeas = await this.extractCoreIntent(
      data.sketch,
      data.prompt,
      data.settings,
    );
    console.log('Concept ideas:', conceptIdeas);
    // Step 2: Generate text-free image designs based on the extracted intent
    const logoVariations = await this.generateTextFreeLogos(
      conceptIdeas,
      data.settings,
    );

    return logoVariations;
  }

  // Extract just the core subject matter and basic intent from the sketch
  async extractCoreIntent(
    sketch: string,
    userPrompt: string,
    settings?: LogoSettings,
  ): Promise<string> {
    console.log("-------------->", settings)
    const dimensionType = settings?.styles?.type === '3d' ? '3D' : '2D';
    const styleType = settings?.styles?.style || '';
    const colorInfo = settings?.colors?.color || '';
    const creativity = settings?.controls?.creativity || 100;
    const detail = settings?.controls?.detail || 100;

    // Creativity descriptions based on level
    const creativityDescription = creativity < 30 ? 'conventional and safe' :
                                  creativity < 70 ? 'balanced and thoughtful' :
                                  'highly innovative and unexpected';
    
    // Detail descriptions based on level
    const detailDescription = detail < 30 ? 'simple, minimal elements with clean lines' :
                              detail < 70 ? 'moderate level of detail with clear focal points' :
                              'intricate, rich textures and complex visual elements';

    // Adjust temperature based on creativity level
    const promptTemperature = creativity / 100 * 0.5 + 0.5; // Scale between 0.5-1.0
    
    const result = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
      method: 'POST',
      headers: {
      Authorization: `Bearer ${this.openRouterApiKey}`,
      'HTTP-Referer': 'https://image-generator.app',
      'X-Title': 'image Generator',
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
        text: `Analyze this sketch and the user prompt: "${userPrompt}"

    TASK: Create a precise, professional text prompt (100-150 words) for generating a ${dimensionType} logo design that EQUALLY incorporates elements from BOTH the sketch AND the user prompt. 
    
    Specifications:
    - Style: ${styleType || 'clean and professional'}
    - Color scheme: ${colorInfo || 'harmonious and balanced'}
    - Creativity approach: ${creativityDescription}
    - Detail level: ${detailDescription}

    Focus on:
    1. Core visual elements from the sketch that represent brand identity
    2. Key concepts and specific requirements from the user prompt
    3. A balanced fusion of the visual elements in the sketch with the concepts in the user prompt
    4. Professional, scalable, and memorable image design
    5. No text elements in the image
    6. ${detail > 70 ? 'Complex visual hierarchy with intricate details that reward closer inspection' : 'Clear shapes with strong silhouettes and balanced composition'}
    7. High contrast and legibility at different sizes
    8. ${creativity > 70 ? 'Groundbreaking, distinctive style that challenges conventional approaches' : 'Distinctive and recognizable form that works as a brand mark'}
    ${detail > 70 ? '9. Incorporate fine details, textures, and subtle gradients where appropriate' : ''}
    ${creativity > 70 ? '10. Explore unexpected color combinations and visual metaphors that surprise and delight' : ''}

    Your response should ONLY contain the generation prompt text with no explanations or formatting.`,
        },
        {
        type: 'image_url',
        image_url: { url: sketch },
        },
        ],
      },
      ],
      temperature: promptTemperature,
      max_tokens: 250,
      }),
      },
    ).then((res) => res.json());

    // Extract just the prompt text from the response
    let promptText = result?.choices[0]?.message?.content || '';
    
    // Remove any potential markdown formatting or explanatory text
    promptText = promptText.replace(/^```.*$/gm, '').trim();
    promptText = promptText.replace(/^"(.*)"$/s, '$1');
    
    return promptText;
  }

  // Generate text-free image designs based on the extracted intent and settings
  async generateTextFreeLogos(
    prompt: string,
    settings?: LogoSettings,
  ): Promise<string[]> {
    try {
      const variations: string[] = [];
      const numberOfVariations = 4;
      
      // Extract key style preferences

      
      for (let i = 0; i < numberOfVariations; i++) {
        const imageBase64 = await this.callGeminiImageGeneration(prompt, (settings?.controls.creativity || 100) / 100);
        
        if (imageBase64) {
          variations.push(imageBase64);
        }
      }

      return variations.length > 0 ? variations : [''];
    } catch (error) {
      this.logger.error(`Error generating text-free image:`, error);
      throw new Error('Failed to generate image variations');
    }
  }

  // Call Gemini image generation with optimized parameters
  private async callGeminiImageGeneration(
    prompt: string,
    temperature: number,
  ): Promise<string> {
    try {
      // Get creativity level from temperature (inverse of the calculation in extractCoreIntent)
      const creativityLevel = ((temperature - 0.5) / 0.5) * 100;
      
      // Enhanced prompt for logo generation with creativity-specific modifiers
      let logoSpecificPrompt = '';
      
      if (creativityLevel > 70) {
        // High creativity prompt
        logoSpecificPrompt = `Create an innovative, original logo design with unexpected elements: ${prompt}. Push creative boundaries with sophisticated visual metaphors and distinctive stylistic choices. The logo should be striking, memorable, and unlike conventional approaches in the industry.`;
      } else if (creativityLevel > 30) {
        // Medium creativity prompt
        logoSpecificPrompt = `Create a balanced, thoughtful logo design: ${prompt}. Combine familiar elements with fresh perspectives to create a distinctive yet accessible visual identity.`;
      } else {
        // Low creativity prompt
        logoSpecificPrompt = `Create a conventional, professional logo design: ${prompt}. Focus on clarity, recognizability, and established design principles for a trustworthy visual identity.`;
      }
      
      console.log('Temperature:', temperature);
      console.log('Using creativity-specific prompt');
      
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp-image-generation',
        generationConfig: {
          responseModalities: ['text','Image'],
          temperature,
        },
      });

      const response = await model.generateContent(logoSpecificPrompt);

      // Extract image data
      for (const part of response.response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }

      return '';
    } catch (error) {
      this.logger.error(`Error in Gemini image generation:`, error);
      return '';
    }
  }
}
