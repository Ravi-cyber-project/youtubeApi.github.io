import { Model } from 'mongoose';
import { UserDocument } from './schema/user.schema';
import { OtpDocument } from './schema/otp.schema';
import { SignUpDto } from './dto/signup.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import { JwtService } from '@nestjs/jwt';
import { ChannelDetailsDto } from './dto/channeldetails.dto';
import { VideoDetailsDto } from './dto/videodetails.dto';
export declare class UserService {
    private readonly userModel;
    private readonly otpModel;
    private readonly jwtService;
    constructor(userModel: Model<UserDocument>, otpModel: Model<OtpDocument>, jwtService: JwtService);
    signUp(body: SignUpDto, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyOtp(body: VerifyOtpDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(body: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getChannelDetailsyId(body: ChannelDetailsDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getVideoDetailsById(body: VideoDetailsDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
