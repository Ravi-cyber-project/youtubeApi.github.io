import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsIn(['email', 'phone_number'])
  @IsString()
  type: string;

  @ValidateIf((o) => o.type === 'email')
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ValidateIf((o) => o.type === 'phone_number')
  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;

  @IsNotEmpty()
  @IsNumber()
  otp: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['verify_email', 'verify_phone_number,login'])
  action: string;
}
