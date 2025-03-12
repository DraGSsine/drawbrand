import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('users')
export class UsersController {
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
}
