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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const signup_dto_1 = require("./dto/signup.dto");
const login_dto_1 = require("./dto/login.dto");
const verifyotp_dto_1 = require("./dto/verifyotp.dto");
const channeldetails_dto_1 = require("./dto/channeldetails.dto");
const videodetails_dto_1 = require("./dto/videodetails.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async signUp(body, res) {
        return await this.userService.signUp(body, res);
    }
    async verifyOtp(body, res) {
        return await this.userService.verifyOtp(body, res);
    }
    async login(body, res) {
        return await this.userService.login(body, res);
    }
    async getChannelDetailsyId(body, res) {
        return await this.userService.getChannelDetailsyId(body, res);
    }
    async getVideoDetailsyId(body, res) {
        return await this.userService.getVideoDetailsById(body, res);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('signUp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignUpDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('verify_otp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verifyotp_dto_1.VerifyOtpDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('get_channel_details'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [channeldetails_dto_1.ChannelDetailsDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getChannelDetailsyId", null);
__decorate([
    (0, common_1.Post)('get_video_details'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [videodetails_dto_1.VideoDetailsDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getVideoDetailsyId", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map