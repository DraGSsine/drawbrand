import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/UserSchema';
import { GenerateDto } from './dto/generate.dto';
import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
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
    const dimensionType = settings?.styles?.type === '3d' ? '3D' : '2D';
    const styleType = settings?.styles?.style || ''; // Expected to match one of our keys
    const colorInfo = settings?.colors?.color || '';
    const creativity = settings?.controls?.creativity || 100;
    const detail = settings?.controls?.detail || 100;

    // Adjust temperature based on creativity level (scale between 0.5-1.0)
    const promptTemperature = (creativity / 100) * 0.5 + 0.5;

    // Descriptions based on creativity levels
    const creativityLevels = {
      10: 'Minimal creative influence with basic structure.',
      20: 'Subtle creative elements with a refined appearance.',
      30: 'Moderate artistic input with a structured approach.',
      40: 'Balanced creativity, blending structure and expression.',
      50: 'Enhanced visual creativity with a unique touch.',
      60: 'Striking artistic interpretation with engaging elements.',
      70: 'Highly imaginative and visually expressive.',
      80: 'Unconventional and distinctive artistic direction.',
      90: 'Innovative, bold, and experimental styling.',
      100: 'Avant-garde, pushing creative boundaries to the limit.',
    };

    // Descriptions based on detail levels
    const detailLevels = {
      10: 'Basic forms with minimal detail.',
      20: 'Simple elements with subtle refinement.',
      30: 'Moderate clarity with defined shapes.',
      40: 'Balanced detailing without excess complexity.',
      50: 'Fine details enhancing overall form.',
      60: 'Intricate elements with refined textures.',
      70: 'Highly detailed with precise composition.',
      80: 'Complex structures with rich visual depth.',
      90: 'Extensive detailing for a sophisticated look.',
      100: 'Ultra-fine details with high artistic precision.',
    };

    // Round down creativity and detail to nearest 10
    const roundedCreativity = Math.floor(creativity / 10) * 10;
    const roundedDetail = Math.floor(detail / 10) * 10;

    // Select descriptions
    const selectedCreativity = creativityLevels[roundedCreativity];
    const selectedDetail = detailLevels[roundedDetail];

    // Define separate objects for 2D and 3D art styles
// Define separate objects for 2D and 3D art styles
const artStyles2D = {
  pictorial: "Distinctive visual elements that directly represent a concept, product, or service with recognizable imagery.",
  mascot: "Character-based design featuring a friendly, distinctive personality that serves as a brand ambassador.",
  badgeCrest: "Emblem-style design with symmetrical layouts that convey heritage, authority, and tradition.",
  cartoon: "Playful, animated designs with exaggerated features and expressive characteristics in a lighthearted style.",
  iconEmoji: "Simplified symbolic representations that convey meaning through universally recognized visual shorthand.",
  abstract: "Non-representational designs using shapes, forms, colors, and lines to create distinctive visual identities without literal imagery.",
  line: "Clean, minimalist designs using continuous strokes to create elegant outlines and simplified representations.",
  pixel: "Blocky, retro-inspired graphics composed of square pixels, reminiscent of early computer and video game aesthetics.",
  comic: "Bold, dynamic illustrations with strong outlines and vibrant colors inspired by comic book art styles.",
  flatGraphic: "Modern, minimalist designs with clean lines, solid colors, and an absence of gradients or dimension.",
  manga: "Japanese comic-inspired art characterized by distinctive stylization, expressive features, and dynamic compositions.",
  kawaii: "Cute, adorable designs featuring rounded shapes, simplified features, and a charming, endearing aesthetic.",
  watercolor: "Soft, flowing designs with blended colors mimicking the delicate, transparent quality of watercolor paintings.",
  pop: "Bold, vibrant designs inspired by pop art, featuring bright colors, strong contrast, and cultural references.",
  illustration: "Detailed, artistic renderings with rich visual storytelling elements and a hand-crafted appearance."
};

const artStyles3D = {
  lowPoly:
    'Simplified 3D forms constructed with angular, faceted surfaces that create an abstract, stylized visual with minimal complexity.',
  realistic:
    'Highly detailed and lifelike 3D renderings featuring intricate textures, natural lighting, and nuanced shadows for true-to-life realism.',
  celShaded:
    '3D models rendered with cartoon-inspired shading, combining bold outlines and flat color areas to produce a dynamic, graphic appearance.',
  sculpted:
    'Intricately crafted 3D designs that capture organic details and subtle textures, giving the impression of a meticulously hand-sculpted form.',
  voxelArt:
    '3D art built from cube-like elements, reminiscent of digital LEGO structures, showcasing a distinctively blocky, retro charm.',
  cyberpunk:
    'Futuristic, dystopian aesthetics marked by neon lights, advanced technology, and gritty urban details set in a 3D environment.',
  fantasy:
    'Richly detailed and imaginative 3D renderings that evoke mythical worlds, featuring dramatic details, vibrant colors, and a sense of wonder.',
  steampunk:
    'Intricate designs blending Victorian elegance with industrial machinery, showcasing brass elements, gears, and weathered mechanical textures.',
  sciFi:
    'Sleek, futuristic aesthetics with streamlined forms and high-tech elements, evoking a vision of advanced technology and space-age design.',
  surreal:
    'Dreamlike, abstract 3D creations that defy reality with distorted forms and imaginative structures, evoking mystery and intrigue.',
  toonStyle:
    '3D models with a soft, cartoon-like quality, featuring exaggerated proportions and gentle shading for a fun, approachable look.',
  claymation:
    'Digital sculptures that mimic the handcrafted feel of clay models, complete with subtle textures and a charming stop-motion vibe.',
  metallic:
    '3D renderings emphasizing reflective, chrome-like surfaces with intricate light interplay, capturing the sleek allure of polished metal.',
  abstract:
    'Non-representational compositions that focus on form, color, and structure to create modern, thought-provoking visuals.',
  organic:
    'Fluid and natural 3D forms emphasizing smooth transitions and soft, curved edges, inspired by shapes found in nature.'
};

    // Select the correct style description based on type
    let chosenStylePrompt = '';
    if (dimensionType === '2D' && styleType && artStyles2D[styleType]) {
      chosenStylePrompt = artStyles2D[styleType];
    } else if (dimensionType === '3D' && styleType && artStyles3D[styleType]) {
      chosenStylePrompt = artStyles3D[styleType];
    } else {
      // Default fallback: flat art for 2D, realistic for 3D
      chosenStylePrompt =
        dimensionType === '2D' ? artStyles2D.flatGraphic : artStyles3D.realistic;
    }

    console.log("---------------------------------------------------------------")
    console.log("artStle pormpt", chosenStylePrompt);

    const result = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.openRouterApiKey}`,
          'HTTP-Referer': 'https://image-generator.app',
          'X-Title': 'Image Generator',
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
                
    TASK: Generate a concise text prompt (50-80 words) for creating a ${dimensionType} logo design that fuses the sketch with the user's request.
    
    - Style: ${chosenStylePrompt}
    - Colors: ${colorInfo || 'harmonious and balanced'}
    - Creativity: ${selectedCreativity}
    - Detail: ${selectedDetail}
    - Must include key elements from the prompt and the sketch structure.
    - **The logo should NOT include any text, letters, or typography.**
    - **aspect_ratio="1:1"**
    
    Your response should ONLY contain the final prompt, nothing else.`,
                },
                {
                  type: 'image_url',
                  image_url: { url: sketch },
                },
              ],
            },
          ],
          max_tokens: 120,
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
        const imageBase64 = await this.callGeminiImageGeneration(
          prompt,
          (settings?.controls.creativity || 100) / 100,
        );

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
          responseModalities: ['text', 'Image'],
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
