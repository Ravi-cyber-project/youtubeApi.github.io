"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMiddleWare = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const environment_1 = require("../../../config/environment");
const user_schema_1 = require("../schema/user.schema");
const mongoose_2 = require("mongoose");
let UserMiddleWare = class UserMiddleWare {
    constructor(jwtService, userModel) {
        this.jwtService = jwtService;
        this.userModel = userModel;
    }
    async use(req, res, next) {
        try {
            const path = ['/user/signup', '/user/verify_otp', '/user/login'];
            if (path.includes(req.originalUrl)) {
                next();
            }
            else if (req.headers && req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1];
                const decode = await this.jwtService.verify(token, {
                    secret: environment_1.ENV.JWT_SECRET_KEY,
                });
                if (decode.hasOwnProperty('role') && decode.hasOwnProperty('id')) {
                    const user = await this.userModel.findById(decode.id);
                    if (!user) {
                        return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                            success: false,
                            message: 'Unauthorized Access',
                        });
                    }
                    next();
                }
                else {
                    return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                        success: false,
                        message: 'Unauthorized access',
                    });
                }
            }
            else {
                return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                    succces: false,
                    message: 'Unauthorized Access',
                });
            }
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }
    }
};
exports.UserMiddleWare = UserMiddleWare;
exports.UserMiddleWare = UserMiddleWare = __decorate([
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        mongoose_2.Model])
], UserMiddleWare);
//# sourceMappingURL=user.middleware.js.map