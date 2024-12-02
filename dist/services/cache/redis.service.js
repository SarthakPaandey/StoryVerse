"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const redis_1 = require("redis");
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
class RedisService {
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: config_1.config.redis.url
        });
        this.client.on('error', (error) => {
            logger_1.logger.error('Redis Client Error:', error);
        });
        this.connect();
    }
    async connect() {
        try {
            await this.client.connect();
            logger_1.logger.info('Redis connected successfully');
        }
        catch (error) {
            logger_1.logger.error('Redis connection error:', error);
            throw error;
        }
    }
    async set(key, value, expireSeconds) {
        try {
            if (expireSeconds) {
                await this.client.setEx(key, expireSeconds, value);
            }
            else {
                await this.client.set(key, value);
            }
        }
        catch (error) {
            logger_1.logger.error('Redis set error:', error);
            throw error;
        }
    }
    async get(key) {
        try {
            return await this.client.get(key);
        }
        catch (error) {
            logger_1.logger.error('Redis get error:', error);
            throw error;
        }
    }
    async del(key) {
        try {
            await this.client.del(key);
        }
        catch (error) {
            logger_1.logger.error('Redis delete error:', error);
            throw error;
        }
    }
}
exports.RedisService = RedisService;
