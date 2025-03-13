import { Controller, Get, Req, UseGuards, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import * as fs from "fs";
import * as path from "path";

@Controller('users')
export class UsersController {
  // Fixed: Define SVG root path correctly
  private readonly svgRoot = path.join(process.cwd(), "public");

  constructor(private readonly usersService: UsersService) {}

  @Get('health')
  async healthCheck() {
    return 'ok';
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req: any) {
    if (!req.user) {
      return null;
    }
    return await this.usersService.getUserInfo(req.user);
  }

  @Get('token')
  @UseGuards(JwtAuthGuard)
  async getToken(@Req() req: any) {
    return { token: req.cookies.token };
  }

  @Get('svgs')
  getSvgs(@Query("category") category: string, @Query("page") page = "1") {
    console.log("SVG request received:", category, page); // Debug log
    console.log("SVG root path:", this.svgRoot); // Debug log
    
    if (!category) {
      throw new BadRequestException('Category parameter is required');
    }
    
    const validCategories = ["solid", "regular", "duotone", "light", "thin","brands"];
    if (!validCategories.includes(category.toLowerCase())) {
      throw new BadRequestException(`Invalid category. Valid options are: ${validCategories.join(', ')}`);
    }

    const categoryPath = path.join(this.svgRoot, category.toLowerCase());
    console.log("Looking for SVGs in:", categoryPath); // Debug log
    
    try {
      // Check if directory exists
      if (!fs.existsSync(categoryPath)) {
        console.log("Directory not found:", categoryPath); // Debug log
        throw new NotFoundException(`Category directory not found: ${category}`);
      }
      
      const files = fs.readdirSync(categoryPath).filter(file => file.endsWith(".svg"));
      console.log(`Found ${files.length} SVG files`); // Debug log
      
      const pageNumber = Math.max(1, parseInt(page, 10) || 1);
      const pageSize = 20;
      const start = (pageNumber - 1) * pageSize;
      const paginatedFiles = files.slice(start, start + pageSize);

      // FIXED: Return paths that match your actual directory structure
      return paginatedFiles.map(file => `/${category.toLowerCase()}/${file}`);
    } catch (error) {
      console.error("Error loading icons:", error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Failed to load icons');
    }
  }
}
