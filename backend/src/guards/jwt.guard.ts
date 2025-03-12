import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['token'];

    if (!token) throw new UnauthorizedException('Error: Sign in required');

    try {
      request.user = this.jwtService.verify(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
