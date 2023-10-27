import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import { ChannelDetailsDto } from './dto/channeldetails.dto';
import { VideoDetailsDto } from './dto/videodetails.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signUp')
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    return await this.userService.signUp(body, res);
  }

  @Post('verify_otp')
  async verifyOtp(@Body() body: VerifyOtpDto, @Res() res: Response) {
    return await this.userService.verifyOtp(body, res);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    return await this.userService.login(body, res);
  }

  @Post('get_channel_details')
  async getChannelDetailsyId(
    @Body() body: ChannelDetailsDto,
    @Res() res: Response,
  ) {
    return await this.userService.getChannelDetailsyId(body, res);
  }

  @Post('get_video_details')
  async getVideoDetailsyId(
    @Body() body: VideoDetailsDto,
    @Res() res: Response,
  ) {
    return await this.userService.getVideoDetailsById(body, res);
  }
}
