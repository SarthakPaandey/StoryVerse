"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_schema_1 = require("../../database/schemas/user.schema");
const logger_1 = require("../../utils/logger");
const redis_service_1 = require("../cache/redis.service");
class UserService {
    constructor() {
        this.redisService = new redis_service_1.RedisService();
    }
    async getUserById(userId) {
        try {
            // Try to get from cache first
            const cachedUser = await this.redisService.get(`user:${userId}`);
            if (cachedUser) {
                return JSON.parse(cachedUser);
            }
            const user = await user_schema_1.User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Cache the user data
            await this.redisService.set(`user:${userId}`, JSON.stringify(user), 3600);
            return user;
        }
        catch (error) {
            logger_1.logger.error('Error fetching user:', error);
            throw error;
        }
    }
    async updateUserStats(userId, stats) {
        try {
            const user = await user_schema_1.User.findByIdAndUpdate(userId, { $set: { 'stats': stats } }, { new: true });
            if (!user) {
                throw new Error('User not found');
            }
            // Invalidate cache
            await this.redisService.del(`user:${userId}`);
            return user;
        }
        catch (error) {
            logger_1.logger.error('Error updating user stats:', error);
            throw error;
        }
    }
    async addReward(userId, reward) {
        try {
            const user = await user_schema_1.User.findByIdAndUpdate(userId, {
                $push: {
                    'rewards.dailyRewards': {
                        date: new Date(),
                        reward,
                        claimed: false
                    }
                }
            }, { new: true });
            if (!user) {
                throw new Error('User not found');
            }
            await this.redisService.del(`user:${userId}`);
            return user;
        }
        catch (error) {
            logger_1.logger.error('Error adding reward:', error);
            throw error;
        }
    }
}
exports.UserService = UserService;
