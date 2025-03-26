import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/UserSchema';
import { GenerateDto } from './dto/generate.dto';
import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import { LogoSettings } from 'src/types/interface';
import { UsersService } from 'src/users/users.service';

// Creativity level descriptions
const CREATIVITY_LEVELS = {
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

// Detail level descriptions
const DETAIL_LEVELS = {
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

// 2D art style descriptions
const ART_STYLES_2D = {
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

// 3D art style descriptions
const ART_STYLES_3D = {
  lowPoly: 'Simplified 3D forms constructed with angular, faceted surfaces that create an abstract, stylized visual with minimal complexity.',
  realistic: 'Highly detailed and lifelike 3D renderings featuring intricate textures, natural lighting, and nuanced shadows for true-to-life realism.',
  celShaded: '3D models rendered with cartoon-inspired shading, combining bold outlines and flat color areas to produce a dynamic, graphic appearance.',
  sculpted: 'Intricately crafted 3D designs that capture organic details and subtle textures, giving the impression of a meticulously hand-sculpted form.',
  voxelArt: '3D art built from cube-like elements, reminiscent of digital LEGO structures, showcasing a distinctively blocky, retro charm.',
  cyberpunk: 'Futuristic, dystopian aesthetics marked by neon lights, advanced technology, and gritty urban details set in a 3D environment.',
  fantasy: 'Richly detailed and imaginative 3D renderings that evoke mythical worlds, featuring dramatic details, vibrant colors, and a sense of wonder.',
  steampunk: 'Intricate designs blending Victorian elegance with industrial machinery, showcasing brass elements, gears, and weathered mechanical textures.',
  sciFi: 'Sleek, futuristic aesthetics with streamlined forms and high-tech elements, evoking a vision of advanced technology and space-age design.',
  surreal: 'Dreamlike, abstract 3D creations that defy reality with distorted forms and imaginative structures, evoking mystery and intrigue.',
  toonStyle: '3D models with a soft, cartoon-like quality, featuring exaggerated proportions and gentle shading for a fun, approachable look.',
  claymation: 'Digital sculptures that mimic the handcrafted feel of clay models, complete with subtle textures and a charming stop-motion vibe.',
  metallic: '3D renderings emphasizing reflective, chrome-like surfaces with intricate light interplay, capturing the sleek allure of polished metal.',
  abstract: 'Non-representational compositions that focus on form, color, and structure to create modern, thought-provoking visuals.',
  organic: 'Fluid and natural 3D forms emphasizing smooth transitions and soft, curved edges, inspired by shapes found in nature.'
};

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

  // Main function
  async generate(data: GenerateDto, userEmail: string) {
    // Step 1: Extract the core intent and subject matter from the sketch and prompt
    const logoPrompt = await this.generateLogoPrompt(
      data.sketch,
      data.prompt,
      data.settings,
    );
    console.log('Logo prompt:', logoPrompt);
    
    // Step 2: Generate text-free image designs based on the extracted intent
    const logoVariations = await this.generateLogoImages(logoPrompt, data.settings);
    
    // Step 3: Update user credits if user information is provided
    await this.updateUserCredits(userEmail);

    return logoVariations;
  }

  // Helper method to update user credits
  private async updateUserCredits(userEmail: string): Promise<void> {
    try {
      // Get current user info
      const userInfo = await this.userModel.findOne({ email: userEmail });
      
      if (userInfo) {
        // Update the user's credits used count by 1
        await this.userModel.updateOne({ email: userEmail }, { $inc: { creditsUsed: 1 } });
      }
    } catch (error) {
      this.logger.error(`Error updating user credits:`, error);
      // Continue with the response even if credits update fails
    }
  }

  // Function for generating the prompt
  async generateLogoPrompt(
    sketch: string,
    userPrompt: string,
    settings?: LogoSettings,
  ): Promise<string> {
    // Check if settings properties are set to "anything" and handle accordingly
    const isAnythingDimension = settings?.styles?.type === 'anything';
    const isAnythingStyle = settings?.styles?.style === 'anything';
    const isAnythingColorType = settings?.colors?.type === 'anything';
    const isAnythingColor = settings?.colors?.color === 'anything';
    const isAnythingCreativity = typeof settings?.controls?.creativity === 'string' && 
                                settings?.controls?.creativity === 'anything';
    const isAnythingDetail = typeof settings?.controls?.detail === 'string' && 
                           settings?.controls?.detail === 'anything';

    // Determine dimension type - default to random choice if set to "anything"
    const dimensionType = isAnythingDimension 
      ? Math.random() > 0.5 ? '3D' : '2D' 
      : settings?.styles?.type === '3d' ? '3D' : '2D';
    
    // Style will be chosen later based on dimension type if set to "anything"
    const styleType = isAnythingStyle ? '' : (settings?.styles?.style || '');
    
    // For colors, handle "anything" as an instruction to the AI
    let colorInfo = '';
    if (isAnythingColor || isAnythingColorType) {
      colorInfo = 'choose the most suitable color palette that perfectly aligns with the style and design';
    } else if (settings?.colors?.type === 'palette' && Array.isArray(settings?.colors?.color)) {
      colorInfo = `use this color palette: ${settings.colors.color.join(', ')}`;
    } else if (settings?.colors?.type === 'solid' && typeof settings?.colors?.color === 'string') {
      colorInfo = `prominently feature this color: ${settings.colors.color}`;
    } else {
      colorInfo = 'use harmonious and balanced colors';
    }
    
    // For creativity and detail, use random values between 50-100 if "anything"
    const creativity = isAnythingCreativity
      ? Math.floor(Math.random() * 51) + 50 // Random between 50-100
      : (typeof settings?.controls?.creativity === 'number' ? settings?.controls?.creativity : 100);
    
    const detail = isAnythingDetail
      ? Math.floor(Math.random() * 51) + 50 // Random between 50-100
      : (typeof settings?.controls?.detail === 'number' ? settings?.controls?.detail : 100);

    // Round down creativity and detail to nearest 10
    const roundedCreativity = Math.floor(creativity / 10) * 10;
    const roundedDetail = Math.floor(detail / 10) * 10;

    // Select descriptions
    const selectedCreativity = CREATIVITY_LEVELS[roundedCreativity];
    const selectedDetail = DETAIL_LEVELS[roundedDetail];

    // Select the correct style description based on type
    let chosenStylePrompt = '';
    
    if (dimensionType === '2D') {
      if (isAnythingStyle) {
        // Choose a random style from 2D options
        const styles2DKeys = Object.keys(ART_STYLES_2D);
        const randomStyle = styles2DKeys[Math.floor(Math.random() * styles2DKeys.length)];
        chosenStylePrompt = ART_STYLES_2D[randomStyle];
      } else if (styleType && ART_STYLES_2D[styleType]) {
        chosenStylePrompt = ART_STYLES_2D[styleType];
      } else {
        chosenStylePrompt = ART_STYLES_2D.flatGraphic;
      }
    } else { // 3D
      if (isAnythingStyle) {
        // Choose a random style from 3D options
        const styles3DKeys = Object.keys(ART_STYLES_3D);
        const randomStyle = styles3DKeys[Math.floor(Math.random() * styles3DKeys.length)];
        chosenStylePrompt = ART_STYLES_3D[randomStyle];
      } else if (styleType && ART_STYLES_3D[styleType]) {
        chosenStylePrompt = ART_STYLES_3D[styleType];
      } else {
        chosenStylePrompt = ART_STYLES_3D.realistic;
      }
    }

    // Build AI instructions based on which sections are set to "anything"
    let aiStyleInstructions: string[] = [];
    
    if (isAnythingDimension && isAnythingStyle) {
      aiStyleInstructions.push('You have complete freedom to choose the best style and dimension for this logo');
    } else if (isAnythingStyle) {
      aiStyleInstructions.push(`You have freedom to choose the best ${dimensionType} style for this logo`);
    } else if (isAnythingDimension) {
      aiStyleInstructions.push('You have freedom to choose between 2D or 3D for the best dimension');
    }
    
    if (isAnythingColor || isAnythingColorType) {
      aiStyleInstructions.push('Select the most suitable color palette that will perfectly complement the style and design');
    }
    
    if (isAnythingCreativity && isAnythingDetail) {
      aiStyleInstructions.push('Balance creativity and detail levels in the most aesthetically pleasing way');
    } else if (isAnythingCreativity) {
      aiStyleInstructions.push('Use your artistic judgment to determine the optimal level of creativity');
    } else if (isAnythingDetail) {
      aiStyleInstructions.push('Use your artistic judgment to determine the optimal level of detail');
    }
    
    // Combine all instructions into a single block
    const aiStyleMode = aiStyleInstructions.length > 0 
      ? `- AI Instructions: ${aiStyleInstructions.join('. ')}.` 
      : '';

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
          model:"qwen/qwen2.5-vl-72b-instruct:free",
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this sketch and the user prompt: "${userPrompt}"
                
    TASK: Generate a concise text prompt (50-80 words) for creating a ${isAnythingDimension ? 'logo' : dimensionType + ' logo'} that fuses the sketch with the user's request.
    
    ${!isAnythingStyle ? `- Style: ${chosenStylePrompt}` : ''}
    - Colors: ${colorInfo}
    ${!isAnythingCreativity ? `- Creativity: ${selectedCreativity}` : ''}
    ${!isAnythingDetail ? `- Detail: ${selectedDetail}` : ''}
    ${aiStyleMode}
    - IMPORTANT: Preserve ALL elements from the sketch and maintain their exact positions and layout
    - Must include key elements from the prompt and the sketch structure.
    - **should NOT include any text**
    
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
    console.log('Result:', result);
    let promptText = result?.choices[0]?.message?.content || '';

    // Remove any potential markdown formatting or explanatory text
    promptText = promptText.replace(/^```.*$/gm, '').trim();
    promptText = promptText.replace(/^"(.*)"$/s, '$1');

    return promptText;
  }

  // Function for generating the images
  async generateLogoImages(
    prompt: string,
    settings?: LogoSettings,
  ): Promise<string[]> {
    try {
      const variations: string[] = [];
      const numberOfVariations = 4;

      for (let i = 0; i < numberOfVariations; i++) {
        const imageBase64 = await this.callGeminiModel(prompt, settings);

        if (imageBase64) {
          variations.push(imageBase64);
        }
      }

      return variations.length > 0 ? variations : [''];
    } catch (error) {
      this.logger.error(`Error generating text-free images:`, error);
      throw new Error('Failed to generate image variations');
    }
  }

  // Private helper method to handle the actual API call
  private async callGeminiModel(
    prompt: string,
    settings?: LogoSettings,
  ): Promise<string> {
    try {
      // Apply randomized temperature if creativity is set to "anything"
      const isAnythingCreativity = typeof settings?.controls?.creativity === 'string' && 
                                  settings?.controls?.creativity === 'anything';
      
      // Use higher temperature for "anything" settings to encourage more variety
      const temperature = isAnythingCreativity
        ? 0.8 + (Math.random() * 0.5) // Random between 0.8 and 1.3
        : Math.min(1.0, (typeof settings?.controls?.creativity === 'number' ? 
                          settings?.controls?.creativity / 100 * 0.5 + 0.6 : 0.9)); // Scale from 0.6 to 1.1
      
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp-image-generation',
        generationConfig: {
          responseModalities: ['text', 'Image'],
          temperature: temperature,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 2048,
        },
      });

      // Build detailed instructions for "anything" settings
      let additionalInstructions = '';
      
      // Check if any section is set to "anything"
      const hasAnythingSettings = 
        settings?.styles?.type === 'anything' || 
        settings?.styles?.style === 'anything' || 
        settings?.colors?.type === 'anything' ||
        settings?.colors?.color === 'anything' ||
        (typeof settings?.controls?.creativity === 'string' && settings.controls.creativity === 'anything') ||
        (typeof settings?.controls?.detail === 'string' && settings.controls.detail === 'anything');
      
      if (hasAnythingSettings) {
        additionalInstructions = ' As an expert logo designer, use your artistic judgment to choose the optimal style, composition, and color palette that will create a distinctive and professional logo. Ensure the final design has visual balance, clear readability, and aligns perfectly with the subject matter.';
      }

      // Use the prompt exactly as provided, with just the square format requirement
      const finalPrompt = `Imagine a logo with absolutely no text: ${prompt}${additionalInstructions} EXTREMELY IMPORTANT: 
1. reproduce ALL elements from the original sketch and maintain their EXACT positions and layout - do not omit any elements or change their arrangement
2. Use a clean, solid background color that provides strong contrast with the logo elements
3. Ensure the logo elements have clear visibility and stand out against the background
4. Avoid complex or busy backgrounds that could distract from the main logo elements
5. If the logo has multiple elements, ensure they have good contrast with each other
6. The background should be simple and professional, enhancing the logo's visibility`;

      const response = await model.generateContent(finalPrompt);

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
