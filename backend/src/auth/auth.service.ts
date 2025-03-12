// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../model/UserSchema';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

interface JwtPayload {
  email: string;
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(user: User) {
    const payload: JwtPayload = { email: user.email, id: (user._id as string).toString() };
    return { token: this.jwtService.sign(payload) };
  }

  async validateUserWithPassword(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user?.password))) {
      return user;
    }
    return null;
  }

  async createUserWithPassword(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({ email, password: hashedPassword });
  }
}