"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const environment_1 = require("../config/environment");
const common_1 = require("@nestjs/common");
const express = require('express');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use('/uploads', express.static('uploads'));
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(environment_1.ENV.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map