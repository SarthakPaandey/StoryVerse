"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const user_schema_1 = require("../../database/schemas/user.schema");
const logger_1 = require("../../utils/logger");
class AuthService {
    async authenticateTelegramUser(telegramData) {
        try {
            let user = await user_schema_1.User.findOne({ telegramId: telegramData.id });
            if (!user) {
                user = await user_schema_1.User.create({
                    telegramId: telegramData.id,
                    username: telegramData.username,
                    createdAt: new Date()
                });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, telegramId: user.telegramId }, config_1.config.jwt.secret, { expiresIn: config_1.config.jwt.expiresIn });
            return { user, token };
        }
        catch (error) {
            logger_1.logger.error('Authentication error:', error);
            throw error;
        }
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        }
        catch (error) {
            logger_1.logger.error('Token verification error:', error);
            throw error;
        }
    }
}
exports.AuthService = AuthService;
