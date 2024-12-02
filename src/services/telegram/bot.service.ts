import { Telegraf } from 'telegraf';
import { config } from '../../config';
import { logger } from '../../utils/logger';
import { StoryService } from '../story/story.service';
import { WebSocketService } from '../websocket/socket.service';

export class TelegramBotService {
  private bot: Telegraf;
  private storyService: StoryService;

  constructor(webSocketService: WebSocketService) {
    if (!config.telegram.botToken) {
      throw new Error('Telegram bot token is not configured');
    }
    this.bot = new Telegraf(config.telegram.botToken);
    this.storyService = new StoryService(webSocketService);
    this.initializeCommands();
  }

  private initializeCommands(): void {
    this.bot.command('start', this.handleStart.bind(this));
    this.bot.command('newstory', this.handleNewStory.bind(this));
    this.bot.command('join', this.handleJoinStory.bind(this));
    this.bot.command('contribute', this.handleContribution.bind(this));
  }

  private async handleStart(ctx: any): Promise<void> {
    try {
      await ctx.reply(
        'Welcome to StoryVerse! 📚\n' +
        'Create or join collaborative stories with AI-generated illustrations.\n\n' +
        'Commands:\n' +
        '/newstory - Create a new story\n' +
        '/join - Join an existing story\n' +
        '/contribute - Add to a story'
      );
    } catch (error) {
      logger.error('Error in start command:', error);
    }
  }

  private async handleNewStory(ctx: any): Promise<void> {
    // Implementation for creating new story
  }

  private async handleJoinStory(ctx: any): Promise<void> {
    // Implementation for joining story
  }

  private async handleContribution(ctx: any): Promise<void> {
    // Implementation for adding contribution
  }

  public async start(): Promise<void> {
    try {
      await this.bot.launch();
      logger.info('Telegram bot started successfully');
    } catch (error) {
      logger.error('Failed to start Telegram bot:', error);
      throw error;
    }
  }
}