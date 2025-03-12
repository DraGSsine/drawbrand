import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/model/UserSchema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema}])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
