// ai/ai.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/model/UserSchema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
