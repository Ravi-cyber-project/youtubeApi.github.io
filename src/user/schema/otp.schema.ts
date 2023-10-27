import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Otp {
  @Prop({ enum: ['email', 'phone_number'] })
  type: string;

  @Prop()
  email: string;

  @Prop()
  phone_number: string;

  @Prop()
  action: string;

  @Prop()
  otp: number;

  @Prop({ default: false })
  is_expired: boolean;

  @Prop()
  expired_at: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
export type OtpDocument = Otp & Document;
