import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/UserSchema';
import { GenerateDto } from './dto/generate.dto';
import { GoogleGenAI } from '@google/genai';
import { LogoSettings } from 'src/types/interface';
import axios from 'axios';


@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly googleGeminiApiKey: string;
  private readonly openRouterApiKey: string;
  private readonly ai: any;

  // Arrays for creativity and detail descriptors (each with 10 options)
  private creativityOptions: string[] = [
    'purely essential and straightforward', // 0 - simplest
    'subtly artistic with a clean approach', // 1
    'tastefully refined with a hint of creativity', // 2
    'moderately innovative and visually engaging', // 3
    'thoughtfully designed with artistic flair', // 4
    'distinctively creative and fresh', // 5
    'highly imaginative and unconventional', // 6
    'boldly inventive and forward-thinking', // 7
    'exceptionally original and groundbreaking', // 8
    'visionary and truly avant-garde', // 9 - most complex
];

private detailOptions: string[] = [
    'pure and essential with no excess', // 0 - simplest
    'intentionally simple and elegant', // 1
    'subtly detailed with a clear focus', // 2
    'minimalist yet purposefully structured', // 3
    'clean and streamlined with essential accents', // 4
    'harmoniously designed with thoughtful details', // 5
    'well-balanced with refined details', // 6
    'finely executed with elegant complexity', // 7
    'richly detailed with sophisticated elements', // 8
    'intricately crafted with exquisite precision', // 9 - most complex
];


  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.openRouterApiKey =
      this.configService.get<string>('OPENROUTER_API_KEY')!;
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY')!,
    });
  }

  /**
   * MAIN PUBLIC METHOD
   * Generate logo variations based on user input
   */
  async generate(data: GenerateDto, userEmail: string): Promise<string[]> {
    try {
      const enhancedPrompt = await this.generateEnhancedPrompt(
        data.prompt,
        data.settings,
        data.sketch,
      );
      this.logger.log(`Enhanced Logo Prompt: ${enhancedPrompt}`);

      const logoVariations = await this.generateLogoImages(enhancedPrompt);

      await this.updateUserCredits(userEmail);

      return logoVariations;
    } catch (error) {
      this.logger.error(`Error in generate method: ${error.message}`);
      throw new Error('Failed to generate logo variations');
    }
  }
  async generateEnhancedPrompt(
    prompt: string,
    settings: LogoSettings,
    sketch: any,
  ): Promise<string> {
    const includeText = settings.text.enabled ? `Use only the exact text: "${settings.text.value}" as the logo name.` : "Do not include any text in the design.";
    const includeTagline = settings.tagline.enabled ? `Use only the exact tagline: "${settings.tagline.value}".` : "Do not include any tagline.";
    const logoRenderStyle = settings.styles.enabled ? `Use the specified render style: ${settings.styles.type}.` : "Choose a suitable render style that fits the concept.";
    const logoStyle = settings.styles.enabled ? `Follow the style: ${settings.styles.style}.` : "Choose the best style that suits the logo.";
    const logoPalette = settings.colors.enabled ? `Use the specified color palette: ${settings.colors.type}.` : "Choose a suitable color palette that fits the concept.";
    const logoColor = settings.colors.enabled ? `Use the specified color: ${settings.colors.color}.` : "Choose a suitable color palette that fits the concept.";
    const creativityIndex = Math.min(Math.max(0, settings.controls.creativity), this.creativityOptions.length - 1);
    const detailIndex = Math.min(Math.max(0, settings.controls.detail), this.detailOptions.length - 1);
    const logoCreativity = this.creativityOptions[creativityIndex];
    const logoDetail = this.detailOptions[detailIndex];
    const logoBackground = settings.background.enabled ? `Use the specified background color: ${settings.background.color}.` : "Use a clean, minimalistic background that complements the logo.";
    
    const promptContent = `
      Generate a logo based on the following instructions:
      - Concept: ${prompt}
      - ${includeText}
      - ${includeTagline}
      - ${logoStyle}
      - ${logoRenderStyle}
      - ${logoColor}
      - ${logoPalette}
      - Creativity Level: ${logoCreativity}
      - Detail Level: ${logoDetail}
      - ${logoBackground}
  
      The design should be well-balanced, visually appealing, and match the given description precisely. 
      *** Ensure that no additional text, random words, or unintended taglines are included. ***
    `;
  
    const messages = [
      {
        role: 'system',
        content: 'You are a precise and detail-oriented assistant that generates optimized logo prompts.',
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: promptContent },
          { type: 'image_url', image_url: { url: sketch } },
        ],
      },
    ];
  
    console.log('Generated Prompt:', promptContent);
  
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'google/gemini-2.5-pro-exp-03-25:free',
          messages: messages,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openRouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://drawbrand.art',
            'X-Title': 'DrawBrand',
          },
        },
      );
      
      // Check if response has expected structure
      if (response.data && response.data.choices && response.data.choices[0]?.message?.content) {
        const content = response.data.choices[0].message.content.trim();
        
        // If the content is JSON, try to extract the prompt field
        if (content.startsWith('{') && content.includes('"prompt"')) {
          try {
            const jsonContent = JSON.parse(content);
            if (jsonContent.prompt) {
              return jsonContent.prompt;
            }
          } catch (jsonError) {
            this.logger.warn(`Failed to parse JSON response: ${jsonError.message}`);
          }
        }
        
        return content;
      }
      
      // Fallback if response structure doesn't match expectations
      this.logger.warn('Unexpected API response structure. Falling back to original prompt.');
      return promptContent.replace(/\n\s*/g, ' ').trim();
    } catch (error) {
      this.logger.error(`Error in generateEnhancedPrompt: ${error.message}`);
      // Fallback to the original prompt if API call fails
      return promptContent.replace(/\n\s*/g, ' ').trim();
    }
  }
  

  async generateLogoImages(prompt: string): Promise<string[]> {
    try {
      const results: string[] = [];
      
      // Make 4 separate API calls to generate different logo variations
      for (let i = 0; i < 4; i++) {
        try {
          const result = await this.ai.models.generateContent({
            model: 'gemini-2.0-flash-exp-image-generation',
            contents: prompt,
            config: {
              responseModalities: ['Text', 'Image'],
            },
          });
          
          if (!result || !result.candidates || result.candidates.length === 0) {
            this.logger.error(`Empty or invalid response from image generation API for logo #${i+1}`);
            continue;
          }
          
          for (const part of result.candidates[0].content.parts) {
            if (part.inlineData) {
              results.push(part.inlineData.data);
              break; // We only need one image per API call
            }
          }
        } catch (error) {
          this.logger.error(`Error generating logo #${i+1}: ${error.message}`);
          // Continue with other logo generations even if one fails
        }
      }
      
      if (results.length === 0) {
        throw new Error('Failed to generate any logo images');
      }
      
      return results;
    } catch (error) {
      this.logger.error(`Error generating logo images: ${error.message}`, error.stack);
      throw new Error(`Failed to generate logo images: ${error.message}`);
    }
  }
  
  private async updateUserCredits(userEmail: string): Promise<void> {
    try {
      const userInfo = await this.userModel.findOne({ email: userEmail });
      
      if (!userInfo) {
        this.logger.warn(`User not found: ${userEmail}`);
        throw new Error(`User not found: ${userEmail}`);
      }
      
      await this.userModel.updateOne(
        { email: userEmail },
        { $inc: { creditsUsed: 1 } },
      );
      
      this.logger.log(`Credits updated successfully for user: ${userEmail}`);
    } catch (error) {
      this.logger.error(`Error updating user credits: ${error.message}`, error.stack);
      throw new Error(`Failed to update user credits: ${error.message}`);
    }
  }
}
