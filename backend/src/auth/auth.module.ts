import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Add this import
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [UsersModule, PassportModule,MailModule],
  providers: [AuthService, GoogleStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
