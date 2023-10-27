import { HttpStatus, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ENV } from 'config/environment';
import { NextFunction, Request, Response } from 'express';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';

export class UserMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const path = ['/user/signup', '/user/verify_otp', '/user/login'];
      if (path.includes(req.originalUrl)) {
        next();
      } else if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const decode = await this.jwtService.verify(token, {
          secret: ENV.JWT_SECRET_KEY,
        });
        if (decode.hasOwnProperty('role') && decode.hasOwnProperty('id')) {
          const user = await this.userModel.findById(decode.id);
          if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
              success: false,
              message: 'Unauthorized Access',
            });
          }
          next();
        } else {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            message: 'Unauthorized access',
          });
        }
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          succces: false,
          message: 'Unauthorized Access',
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
