import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ default: '', trim: true })
  first_name: string;

  @Prop({ default: '', trim: true })
  last_name: string;

  @Prop({ default: '', trim: true, lowercase: true })
  email: string;

  @Prop({ default: '', trim: true })
  phone_number: string;

  @Prop({ default: '', trim: true })
  password: string;

  @Prop({ default: false })
  is_email_verified: boolean;

  @Prop({ default: false })
  is_phone_verified: boolean;

  @Prop({ default: null })
  email_verified_at: Date;

  @Prop({ default: null })
  phone_verified_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
