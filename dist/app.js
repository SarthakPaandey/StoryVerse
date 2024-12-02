"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const socket_service_1 = require("./services/websocket/socket.service");
const error_middleware_1 = require("./middleware/error.middleware");
const connection_1 = require("./database/connection");
const bot_service_1 = require("./services/telegram/bot.service");
const redis_service_1 = require("./services/cache/redis.service");
const bull_service_1 = require("./services/queue/bull.service");
const logger_1 = require("./utils/logger");
const index_1 = require("./routes/index");
class Application {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.webSocketService = new socket_service_1.WebSocketService(this.server);
        this.telegramBot = new bot_service_1.TelegramBotService(this.webSocketService);
        this.redisService = new redis_service_1.RedisService();
        this.queueService = new bull_service_1.QueueService();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Rate limiting
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        });
        this.app.use(limiter);
    }
    setupErrorHandling() {
        this.app.use((err, req, res, next) => {
            (0, error_middleware_1.errorHandler)(err, req, res, next);
        });
    }
    setupRoutes() {
        this.app.use('/api', (0, index_1.createRouter)(this.webSocketService));
    }
    async start() {
        try {
            // Connect to MongoDB
            await (0, connection_1.connectDatabase)();
            // Start Telegram bot
            await this.telegramBot.start();
            // Start Express server
            const PORT = process.env.PORT || 3000;
            this.server.listen(PORT, () => {
                logger_1.logger.info(`Server is running on port ${PORT}`);
            });
        }
        catch (error) {
            logger_1.logger.error('Application startup error:', error);
            process.exit(1);
        }
    }
}
exports.Application = Application;
