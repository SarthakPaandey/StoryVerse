"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const bull_1 = __importDefault(require("bull"));
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
const ai_service_1 = require("../ai/ai.service");
class QueueService {
    constructor() {
        this.imageGenerationQueue = new bull_1.default('image-generation', config_1.config.redis.url);
        this.aiService = new ai_service_1.AIService();
        this.setupQueues();
    }
    setupQueues() {
        this.imageGenerationQueue.process(async (job) => {
            try {
                const { prompt, storyId, contributionId } = job.data;
                const imageUrl = await this.aiService.generateImage(prompt);
                return { imageUrl, storyId, contributionId };
            }
            catch (error) {
                logger_1.logger.error('Image generation job failed:', error);
                throw error;
            }
        });
        this.imageGenerationQueue.on('completed', (job, result) => {
            logger_1.logger.info(`Job ${job.id} completed with result:`, result);
        });
        this.imageGenerationQueue.on('failed', (job, error) => {
            logger_1.logger.error(`Job ${job.id} failed:`, error);
        });
    }
    async addImageGenerationJob(data) {
        try {
            await this.imageGenerationQueue.add(data, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Error adding job to queue:', error);
            throw error;
        }
    }
}
exports.QueueService = QueueService;
