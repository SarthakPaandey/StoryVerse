"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        apiId: process.env.TELEGRAM_API_ID,
        apiHash: process.env.TELEGRAM_API_HASH,
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/storyverse',
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret',
        expiresIn: '7d',
    },
    ai: {
        huggingFaceApiKey: process.env.HUGGING_FACE_API_KEY,
    },
};
