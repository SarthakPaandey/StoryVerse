import Queue from 'bull';
import { config } from '../../config';
import { logger } from '../../utils/logger';
import { AIService } from '../ai/ai.service';

export class QueueService {
  private imageGenerationQueue: Queue.Queue;
  private aiService: AIService;

  constructor() {
    this.imageGenerationQueue = new Queue('image-generation', config.redis.url);
    this.aiService = new AIService();
    this.setupQueues();
  }

  private setupQueues(): void {
    this.imageGenerationQueue.process(async (job) => {
      try {
        const { prompt, storyId, contributionId } = job.data;
        const imageUrl = await this.aiService.generateImage(prompt);
        return { imageUrl, storyId, contributionId };
      } catch (error) {
        logger.error('Image generation job failed:', error);
        throw error;
      }
    });

    this.imageGenerationQueue.on('completed', (job, result) => {
      logger.info(`Job ${job.id} completed with result:`, result);
    });

    this.imageGenerationQueue.on('failed', (job, error) => {
      logger.error(`Job ${job.id} failed:`, error);
    });
  }

  async addImageGenerationJob(data: {
    prompt: string;
    storyId: string;
    contributionId: string;
  }): Promise<void> {
    try {
      await this.imageGenerationQueue.add(data, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      });
    } catch (error) {
      logger.error('Error adding job to queue:', error);
      throw error;
    }
  }
}