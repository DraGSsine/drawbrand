import {
  Body,
  Controller,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { planType } from 'src/types/types';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(@Request() req, @Body('plan') plan: planType) {
    return this.paymentsService.createCheckoutSession(plan, req.user.id);
  }

  @Post('webhok')
  async stripeWebhook(@Request() req, @Response() res) {
    return this.paymentsService.stripeWebhook(req, res);
  }
}
