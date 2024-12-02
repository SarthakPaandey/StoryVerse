"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramBotService = void 0;
const telegraf_1 = require("telegraf");
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
const story_service_1 = require("../story/story.service");
class TelegramBotService {
    constructor(webSocketService) {
        if (!config_1.config.telegram.botToken) {
            throw new Error('Telegram bot token is not configured');
        }
        this.bot = new telegraf_1.Telegraf(config_1.config.telegram.botToken);
        this.storyService = new story_service_1.StoryService(webSocketService);
        this.initializeCommands();
    }
    initializeCommands() {
        this.bot.command('start', this.handleStart.bind(this));
        this.bot.command('newstory', this.handleNewStory.bind(this));
        this.bot.command('join', this.handleJoinStory.bind(this));
        this.bot.command('contribute', this.handleContribution.bind(this));
    }
    async handleStart(ctx) {
        try {
            await ctx.reply('Welcome to StoryVerse! 📚\n' +
                'Create or join collaborative stories with AI-generated illustrations.\n\n' +
                'Commands:\n' +
                '/newstory - Create a new story\n' +
                '/join - Join an existing story\n' +
                '/contribute - Add to a story');
        }
        catch (error) {
            logger_1.logger.error('Error in start command:', error);
        }
    }
    async handleNewStory(ctx) {
        // Implementation for creating new story
    }
    async handleJoinStory(ctx) {
        // Implementation for joining story
    }
    async handleContribution(ctx) {
        // Implementation for adding contribution
    }
    async start() {
        try {
            await this.bot.launch();
            logger_1.logger.info('Telegram bot started successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to start Telegram bot:', error);
            throw error;
        }
    }
}
exports.TelegramBotService = TelegramBotService;
