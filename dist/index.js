"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const logger_1 = require("./utils/logger");
async function bootstrap() {
    try {
        const app = new app_1.Application();
        await app.start();
    }
    catch (error) {
        logger_1.logger.error('Bootstrap error:', error);
        process.exit(1);
    }
}
bootstrap();
