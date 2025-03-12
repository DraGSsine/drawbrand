// auth.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { MailService } from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
  private resHeaders: CookieOptions = {
    domain: process.env.PROD === 'true' ? '.scrive.pro' : 'localhost',
    sameSite: process.env.PROD === 'true' ? 'none' : 'lax',
    secure: process.env.PROD === 'true' ? true : false,
    httpOnly: true,
  };
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signIn(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUserWithPassword(
      body.email,
      body.password,
    );
    if (!user) throw new BadRequestException('Invalid email or password');
    const { token } = await this.authService.signin(user);
    res.cookie('token', token, this.resHeaders);
    res.json({ token });
  }

  @Post('signup')
  async signUp(@Body() body: { email: string }) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await this.mailService.sendOtp(body.email, otp);
      return { message: 'success' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('verify')
  async verifyOtp(
    @Body() body: { email: string; otp: string },
    @Res() res: Response,
  ) {
    const isValid = await this.mailService.validateOtp(body.email, body.otp);
    if (!isValid) throw new BadRequestException('Invalid OTP');
    const user = await this.authService.createUserWithPassword(
      body.email,
      body.otp,
    );
    const { token } = await this.authService.signin(user);
    res.cookie('token', token, this.resHeaders);
    res.json({ token });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { token } = await this.authService.signin(req.user);
    const redirectUrl = this.configService.get<string>('FRONTEND_URL');
    res.cookie('token', token, this.resHeaders);
    res.redirect(`${redirectUrl}/auth/signin?token=${token}`);
  }

  @Post('signout')
  signOut(@Res() res: Response) {
    res.clearCookie('token', this.resHeaders);
    res.json({ message: 'success' });
  }
}
