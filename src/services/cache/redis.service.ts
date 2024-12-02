import { createClient, RedisClientType } from 'redis';
import { config } from '../../config';
import { logger } from '../../utils/logger';

export class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: config.redis.url
    });

    this.client.on('error', (error) => {
      logger.error('Redis Client Error:', error);
    });

    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.info('Redis connected successfully');
    } catch (error) {
      logger.error('Redis connection error:', error);
      throw error;
    }
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    try {
      if (expireSeconds) {
        await this.client.setEx(key, expireSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      logger.error('Redis set error:', error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error('Redis get error:', error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Redis delete error:', error);
      throw error;
    }
  }
}