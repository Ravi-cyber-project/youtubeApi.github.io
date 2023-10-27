import { HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument } from './schema/otp.schema';
import { SignUpDto } from './dto/signup.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ENV } from 'config/environment';
import { ChannelDetailsDto } from './dto/channeldetails.dto';
import { VideoDetailsDto } from './dto/videodetails.dto';
import { HttpService } from '@nestjs/axios';
import { YouTubeCredentials } from 'config/youtubeconfig';
import axios from 'axios';
import * as fs from 'fs';
import { getApiData } from 'src/helper/getdatafromapi.helper';
const xl = require('excel4node');

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(body: SignUpDto, res: Response) {
    try {
      const user = await this.userModel.findOne({
        $and: [{ email: body.email }, { phone_number: body.phone_number }],
      });
      if (user) {
        return res.status(HttpStatus.FOUND).json({
          success: false,
          message: `email or phone_number already exist`,
        });
      }
      const hashedPassword = await bcrypt.hash(body.password, 10);
      delete body.password;
      body['password'] = hashedPassword;
      await new this.userModel(body).save();
      const numberOtp = Math.floor(Math.random() * 10000);
      const mailOtp = Math.floor(Math.random() * 10000);
      await new this.otpModel({
        type: 'email',
        email: body.email,
        action: `verify_email`,
        otp: mailOtp,
        expired_at: new Date(new Date().getTime() + 1000 * 60 * 2),
      }).save();
      await new this.otpModel({
        type: 'phone_number',
        phone_number: body.phone_number,
        action: `verify_email`,
        otp: numberOtp,
        expired_at: new Date(new Date().getTime() + 1000 * 60 * 2),
      }).save();
      return res.status(HttpStatus.CREATED).json({
        success: false,
        messsage: `Otp sent successfully on your email and phone_number, Please verify otp`,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyOtp(body: VerifyOtpDto, res: Response) {
    try {
      const findOtp = await this.otpModel.findOne({
        $or: [
          { email: body.email, expired_at: { $gte: Date.now() } },
          { phone_number: body.phone_number, expired_at: { $gte: new Date() } },
        ],
      });
      if (!findOtp) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'No otp found',
        });
      }
      if (findOtp.action !== body.action) {
        return res.status(HttpStatus.EXPECTATION_FAILED).json({
          success: false,
          messsage: 'Wrong action entered',
        });
      }
      if (findOtp.otp !== body.otp) {
        return res.status(HttpStatus.EXPECTATION_FAILED).json({
          success: false,
          message: 'Wrong otp entered',
        });
      }
      if (body.type === 'email') {
        await this.userModel.findOneAndUpdate(
          { email: body.email },
          {
            is_email_verified: true,
            email_verified_at: Date.now(),
          },
        );
      }
      if (body.type === 'phone_number') {
        await this.userModel.findOneAndUpdate(
          { phone_number: body.phone_number },
          {
            is_phone_verified: true,
            phone_verified_at: Date.now(),
          },
        );
      }
      findOtp.deleteOne();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Otp verified successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(body: LoginDto, res: Response) {
    try {
      const user = await this.userModel.findOne({ email: body.email });
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: `Email not registered, Please signup first`,
        });
      }
      if (
        user.is_email_verified === false ||
        user.is_phone_verified === false
      ) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: `Please verify your email and phone_number first`,
        });
      }
      const matchPassword = await bcrypt.compare(body.password, user.password);
      if (!matchPassword) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'Wrong password entered',
        });
      }
      const payload = {
        id: user._id,
        role: 'role',
      };
      const token = await this.jwtService.sign(payload, {
        secret: ENV.JWT_SECRET_KEY,
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Login successfull',
        token,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getChannelDetailsyId(body: ChannelDetailsDto, res: Response) {
    try {
      let channelDetails = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${YouTubeCredentials.API_KEY}&channelId=${body.channel_id}&part=snippet,id&order=date&maxResults=50`,
      );
      
      if (channelDetails.data.pageInfo.totalResults === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'No data found',
        });
      }
      let arr = [...channelDetails.data.items];
      let nextToken = channelDetails.data.nextPageToken;
      while (nextToken) {
        let data = await getApiData(nextToken, body.channel_id);
        console.log(data)
        nextToken = data.nextPageToken;
        // console.log(nextToken)
        arr = [...arr, ...data.items];
      }
      // console.log(arr)

      const wb = new xl.Workbook();
      const ws = wb.addWorksheet('Worksheet Name');
      const data = channelDetails.data.items;
      let result = [];
      for (let item of data) {
        const itemObj = {
          Kind: item?.kind ?? '',
          Etag: item?.etag ?? '',
          Id_Kind: item?.id?.kind ?? '',
          VideoId: item?.id?.videoId ?? '',
          PublishedAt:
            new Date(item?.snippet?.publishedAt).toDateString() ?? '',
          ChannelId: item?.snippet?.channelId ?? '',
          Title: item?.snippet?.title ?? '',
          Description: item?.snippet?.description ?? '',
          Thumbnails_Default_Url: item?.snippet?.thumbnails?.default?.url ?? '',
          Thumbnails_Default_Width:
            item?.snippet?.thumbnails?.default?.width.toString() ?? '',
          Thumbnails_Default_Height:
            item?.snippet?.thumbnails?.default?.height.toString() ?? '',
          Thumbnails_Medium_Url: item?.snippet?.thumbnails?.medium?.url ?? '',
          Thumbnails_Medium_Width:
            item?.snippet?.thumbnails?.medium?.width.toString() ?? '',
          Thumbnails_Medium_Height:
            item?.snippet?.thumbnails?.medium?.height.toString() ?? '',
          Thumbnails_High_Url: item?.snippet?.thumbnails?.high?.url ?? '',
          Thumbnails_High_Width:
            item?.snippet?.thumbnails?.high?.width.toString() ?? '',
          Thumbnails_High_Height:
            item?.snippet?.thumbnails?.high?.height.toString() ?? '',
          ChannelTitle: item?.snippet?.channelTitle ?? '',
          LiveBroadcastContent: item?.snippet?.liveBroadcastContent ?? '',
          PublishTime:
            new Date(item?.snippet?.publishTime).toDateString() ?? '',
        };
        for (let tag in item.snippet.tags) {
          const key = 'Tag' + (Number(tag) + 1);
          const value = item.snippet.tags[tag];
          itemObj[key] = value;
        }
        result.push(itemObj);
      }

      const headingColumnNames = Object.keys(result[0]);
      //Write Column Title in Excel file
      let headingColumnIndex = 1;
      headingColumnNames.forEach((heading) => {
        ws.cell(1, headingColumnIndex++).string(heading);
      });
      //Write Data in Excel file
      let rowIndex = 2;
      result.forEach((record) => {
        let columnIndex = 1;
        Object.keys(record).forEach((columnName) => {
          ws.cell(rowIndex, columnIndex++).string(record[columnName]);
        });
        rowIndex++;
      });
      wb.write('uploads/data.xlsx');

      return res.status(HttpStatus.OK).json({
        success: true,
        fileLink: `${ENV.BASE_URL}/uploads/data.xlsx`,
        // kind: channelDetails.data.kind,
        etag: channelDetails.data,
        // channelDetails: channelDetails.data.items,
        // total: channelDetails.data.pageInfo.totalResults,
        // limit: channelDetails.data.pageInfo.resultsPerPage,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getVideoDetailsById(body: VideoDetailsDto, res: Response) {
    try {
      const videoDetails = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${body.video_id}&key=${YouTubeCredentials.API_KEY}`,
      );

      if (videoDetails.data.pageInfo.totalResults === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'No data found',
        });
      }

      const wb = new xl.Workbook();
      const ws = wb.addWorksheet('Worksheet Name');
      const data = videoDetails.data.items;
      let result = [];
      for (let item of data) {
        const itemObj = {
          Kind: item?.kind ?? '',
          Etag: item?.etag ?? '',
          Id: item?.id ?? '',
          PublishedAt: item?.snippet?.publishedAt ?? '',
          ChannelId: item?.snippet?.channelId ?? '',
          Title: item?.snippet?.title ?? '',
          Description: item?.snippet?.description ?? '',
          Thumbnails_Default_Url: item?.snippet?.thumbnails?.default?.url ?? '',
          Thumbnails_Default_Width:
            item?.snippet?.thumbnails?.default?.width.toString() ?? '',
          Thumbnails_Default_Height:
            item?.snippet?.thumbnails?.default?.height.toString() ?? '',
          Thumbnails_Medium_Url: item?.snippet?.thumbnails?.medium?.url ?? '',
          Thumbnails_Medium_Width:
            item?.snippet?.thumbnails?.medium?.width.toString() ?? '',
          Thumbnails_Medium_Height:
            item?.snippet?.thumbnails?.medium?.height.toString() ?? '',
          Thumbnails_High_Url: item?.snippet?.thumbnails?.high?.url ?? '',
          Thumbnails_High_Width:
            item?.snippet?.thumbnails?.high?.width.toString() ?? '',
          Thumbnails_High_Height:
            item?.snippet?.thumbnails?.high?.height.toString() ?? '',
          Thumbnails_Standard_Url:
            item?.snippet?.thumbnails?.standard?.url ?? '',
          Thumbnails_Standard_Width:
            item?.snippet?.thumbnails?.standard?.width.toString() ?? '',
          Thumbnails_Standard_Height:
            item?.snippet?.thumbnails?.standard?.height.toString() ?? '',
          Thumbnails_Maxres_Url: item?.snippet?.thumbnails?.maxres?.url ?? '',
          Thumbnails_Maxres_Width:
            item?.snippet?.thumbnails?.maxres?.width.toString() ?? '',
          Thumbnails_Maxres_Height:
            item?.snippet?.thumbnails?.maxres?.height.toString() ?? '',
          ChannelTitle: item?.snippet?.channelTitle ?? '',
          CategoryId: item?.snippet?.categoryId ?? '',
          LiveBroadcastContent: item?.snippet?.liveBroadcastContent ?? '',
          DefaultLanguage: item?.snippet?.defaultLanguage ?? '',
          Localized_Title: item?.snippet?.localized?.title ?? '',
          Localized_Description: item?.snippet?.localized?.description ?? '',
          DefaultAudioLanguage: item?.snippet?.defaultAudioLanguage ?? '',
          Duration: item?.contentDetails?.duration ?? '',
          Dimension: item?.contentDetails?.dimension ?? '',
          Definition: item?.contentDetails?.definition ?? '',
          Caption: item?.contentDetails?.caption ?? '',
          LicensedContent:
            item?.contentDetails?.licensedContent.toString() ?? '',
          ContentRating: item?.contentDetails?.contentRating ?? '',
          Projection: item?.contentDetails?.projection ?? '',
          ViewCount: item?.statistics?.viewCount ?? '',
          LikeCount: item?.statistics?.likeCount ?? '',
          FavoriteCount: item?.statistics?.favoriteCount ?? '',
          CommentCount: item?.statistics?.commentCount ?? '',
        };
        for (let tag in item.snippet.tags) {
          const key = 'Tag' + (Number(tag) + 1);
          const value = item.snippet.tags[tag];
          itemObj[key] = value;
        }
        for (let key in item.contentDetails.contentRating) {
          console.log(key);
        }
        result.push(itemObj);
      }

      // console.log(flattenObj(ob));
      const headingColumnNames = Object.keys(result[0]);
      //Write Column Title in Excel file
      let headingColumnIndex = 1;
      headingColumnNames.forEach((heading) => {
        ws.cell(1, headingColumnIndex++).string(heading);
      });
      //Write Data in Excel file
      let rowIndex = 2;
      result.forEach((record) => {
        let columnIndex = 1;
        Object.keys(record).forEach((columnName) => {
          ws.cell(rowIndex, columnIndex++).string(record[columnName]);
        });
        rowIndex++;
      });
      wb.write('uploads/data.xlsx');
      // fs.writeFileSync(`uploads/aaaaaaaaas`,);
      return res.status(HttpStatus.OK).json({
        success: true,
        fileLink: `${ENV.BASE_URL}/uploads/data.xlsx`,
        // total: videoDetails.data.pageInfo.totalResults,
        // limit: videoDetails.data.pageInfo.resultsPerPage,
        // kind: videoDetails.data.kind,
        // etag: videoDetails.data.etag,
        // videoDetails: videoDetails.data.items,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
