// users.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../model/UserSchema';
import * as crypto from 'crypto';
interface GoogleProfile {
  emails?: Array<{ value: string }>;
  id: string;
  displayName?: string;
  photos?: Array<{ value: string }>;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private async checkUserExists(email: string): Promise<void> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
  }

  async findOrCreate(profile: GoogleProfile): Promise<User> {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new Error('No email provided in Google profile');

    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = new this.userModel({
        email,
        googleId: profile.id,
        displayName: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        password: crypto.randomBytes(16).toString('hex'),
      });
      await user.save();
    }

    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    await this.checkUserExists(userData.email!);
    const user = new this.userModel(userData);
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async getUserInfo(user: { email: string; id: any }) {
    const userExist = await this.userModel.findOne({ email: user.email });
    if (!userExist) {
      return null;
    }
    return {
      email: userExist.email,
      displayName: userExist.displayName,
      avatar: userExist.avatar,
      plan: userExist.plan,
      monthlyCredits: userExist.monthlyCredits,
      creditsUsed: userExist.creditsUsed,
    };
  }
}
