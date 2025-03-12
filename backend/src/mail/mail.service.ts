import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resend } from 'resend';
import { Otp } from 'src/model/OtpSchema';
@Injectable()
export class MailService {
  resend = new Resend(this.configService.get('RESEND_API_KEY'));

  constructor(
    private configService: ConfigService,
    @InjectModel(Otp.name) private otpModule: Model<Otp>,
  ) {}

  async sendOtp(email: string, otp: string) {
    const { data, error } = await this.resend.emails.send({
      from: 'youchen@scrive.pro',
      to: [email],
      subject: 'Your Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 40px 20px;
            background-color: white;
            color: #1a1a1a;
          ">
            <div style="
              max-width: 400px;
              margin: 0 auto;
            ">
              <h1 style="
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 24px;
                color: #1a1a1a;
              ">Scrive</h1>
              
              <p style="
                font-size: 16px;
                color: #4a4a4a;
                margin-bottom: 32px;
              ">Here's your verification code:</p>
              
              <div style="
                font-size: 32px;
                font-weight: 600;
                letter-spacing: 8px;
                color: #2563eb;
                margin-bottom: 32px;
              ">${otp}</div>
              
              <p style="
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 24px;
                border-top: 1px solid #e5e7eb;
                padding-top: 24px;
              ">
                This code will expire in 10 minutes.<br>
                If you didn't request this code, please ignore this email.
              </p>
              
              <p style="
                font-size: 12px;
                color: #9ca3af;
              ">
                © 2025 Scrive. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      return console.error({ error });
    }
    await this.otpModule.create({ email, otp });
    console.log({ data });
  }

  async validateOtp(email: string, otp: string) {
    const otpData = await this.otpModule.findOne({ email, otp });
    if (!otpData) return false;

    console.log('otp', otpData.otp);
    console.log('otp', otp);
    if (otpData.otp !== otp) return false;

    return true;
  }
}
