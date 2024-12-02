import { Story, IStory } from '../../database/schemas/story.schema';
import { AIService } from '../ai/ai.service';
import { WebSocketService } from '../websocket/socket.service';
import { logger } from '../../utils/logger';

export class StoryService {
  private aiService: AIService;
  private webSocketService: WebSocketService;

  constructor(webSocketService: WebSocketService) {
    this.aiService = new AIService();
    this.webSocketService = webSocketService;
  }

  async createStory(storyData: Partial<IStory>): Promise<IStory> {
    try {
      const story = new Story(storyData);
      await story.save();
      return story;
    } catch (error) {
      logger.error('Error creating story:', error);
      throw error;
    }
  }

  async addContribution(
    storyId: string, 
    userId: string, 
    content: string
  ): Promise<IStory> {
    try {
      // Moderate content
      const isSafe = await this.aiService.moderateContent(content);
      if (!isSafe) {
        throw new Error('Content violates community guidelines');
      }

      // Generate image for contribution
      const imageUrl = await this.aiService.generateImage(content);

      const story = await Story.findByIdAndUpdate(
        storyId,
        {
          $push: {
            contributions: {
              userId,
              content,
              imageUrl,
              votes: 0,
              createdAt: new Date()
            }
          }
        },
        { new: true }
      );

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
    } catch (error) {
      logger.error('Error adding contribution:', error);
      throw error;
    }
  }

  async getStory(storyId: string): Promise<IStory> {
    try {
      const story = await Story.findById(storyId);
      if (!story) {
        throw new Error('Story not found');
      }
      return story;
    } catch (error) {
      logger.error('Error fetching story:', error);
      throw error;
    }
  }
}