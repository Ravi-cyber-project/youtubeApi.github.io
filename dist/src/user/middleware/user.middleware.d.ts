import { NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';
export declare class UserMiddleWare implements NestMiddleware {
    private readonly jwtService;
    private readonly userModel;
    constructor(jwtService: JwtService, userModel: Model<UserDocument>);
    use(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
