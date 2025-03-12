import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Otp extends Document {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    otp: string;
    @Prop({ default: Date.now, expires: 600 })
    createdAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);