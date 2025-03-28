import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/UserSchema';
@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    const userId = request.user.id;
    if (!userId) throw new UnauthorizedException('No user id provided');

    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const userPlan = user.plan;
    const userUsage = user.creditsUsed;
    const userMonthlyCredits = user.monthlyCredits;
    const usageExceeded = userMonthlyCredits === 9999 ? false : userUsage >= userMonthlyCredits;
    if (!userPlan)
      throw new UnauthorizedException("You don't have a subscription plan please visit http://localhost:3000");
    if (userPlan === 'none')
      throw new UnauthorizedException('You do not have a subscription plan please visit http://localhost:3000');
    if (userPlan === 'free' && usageExceeded) {
      await this.userModel.findByIdAndUpdate(userId, { plan: 'none' });
      throw new UnauthorizedException('Free plan limit reached please visit https://drawbrand.art');
    }
    if (userPlan === 'Starter' && usageExceeded) {
      await this.userModel.findByIdAndUpdate(userId, { plan: 'none' });
      throw new UnauthorizedException('Starter plan limit reached please visit http://localhost:3000');
    }

    return true;
  }
}
