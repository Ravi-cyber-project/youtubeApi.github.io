import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import { ChannelDetailsDto } from './dto/channeldetails.dto';
import { VideoDetailsDto } from './dto/videodetails.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signUp(body: SignUpDto, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyOtp(body: VerifyOtpDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(body: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getChannelDetailsyId(body: ChannelDetailsDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getVideoDetailsyId(body: VideoDetailsDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
