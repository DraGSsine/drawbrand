import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  email: string;

  @Prop({ default: null })
  googleId?: string;

  @Prop()
  displayName?: string;

  @Prop({ default: 'https://www.gravatar.com/avatar/  ' })
  avatar?: string;

  @Prop()
  password: string;

  @Prop({ enum: ['free', 'Starter', 'Growth'], default: 'free' })
  plan: string;

  @Prop({ default: 0 })
  creditsUsed: number;

  @Prop({ default: 10 })
  monthlyCredits: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
