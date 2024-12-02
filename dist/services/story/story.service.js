"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryService = void 0;
const story_schema_1 = require("../../database/schemas/story.schema");
const ai_service_1 = require("../ai/ai.service");
const logger_1 = require("../../utils/logger");
class StoryService {
    constructor(webSocketService) {
        this.aiService = new ai_service_1.AIService();
        this.webSocketService = webSocketService;
    }
    async createStory(storyData) {
        try {
            const story = new story_schema_1.Story(storyData);
            await story.save();
            return story;
        }
        catch (error) {
            logger_1.logger.error('Error creating story:', error);
            throw error;
        }
    }
    async addContribution(storyId, userId, content) {
        try {
            // Moderate content
            const isSafe = await this.aiService.moderateContent(content);
            if (!isSafe) {
                throw new Error('Content violates community guidelines');
            }
            // Generate image for contribution
            const imageUrl = await this.aiService.generateImage(content);
            const story = await story_schema_1.Story.findByIdAndUpdate(storyId, {
                $push: {
                    contributions: {
                        userId,
                        content,
                        imageUrl,
                        votes: 0,
                        createdAt: new Date()
                    }
                }
            }, { new: true });
            if (!story) {
                throw new Error('Story not found');
            }
            // Notify all users in the story room
            this.webSocketService.emitNewContribution(storyId, {
                userId,
                content,
                imageUrl,
                createdAt: new Date()
            });
            return story;
        }
        catch (error) {
            logger_1.logger.error('Error adding contribution:', error);
            throw error;
        }
    }
    async getStory(storyId) {
        try {
            const story = await story_schema_1.Story.findById(storyId);
            if (!story) {
                throw new Error('Story not found');
            }
            return story;
        }
        catch (error) {
            logger_1.logger.error('Error fetching story:', error);
            throw error;
        }
    }
}
exports.StoryService = StoryService;
