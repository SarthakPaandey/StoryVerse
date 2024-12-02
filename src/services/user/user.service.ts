import { User, IUser } from '../../database/schemas/user.schema';
import { logger } from '../../utils/logger';
import { RedisService } from '../cache/redis.service';

export class UserService {
  private redisService: RedisService;

  constructor() {
    this.redisService = new RedisService();
  }

  async getUserById(userId: string): Promise<IUser> {
    try {
      // Try to get from cache first
      const cachedUser = await this.redisService.get(`user:${userId}`);
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Cache the user data
      await this.redisService.set(`user:${userId}`, JSON.stringify(user), 3600);
      return user;
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUserStats(userId: string, stats: Partial<IUser['stats']>): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { 'stats': stats } },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      // Invalidate cache
      await this.redisService.del(`user:${userId}`);
      return user;
    } catch (error) {
      logger.error('Error updating user stats:', error);
      throw error;
    }
  }

  async addReward(userId: string, reward: string): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            'rewards.dailyRewards': {
              date: new Date(),
              reward,
              claimed: false
            }
          }
        },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      await this.redisService.del(`user:${userId}`);
      return user;
    } catch (error) {
      logger.error('Error adding reward:', error);
      throw error;
    }
  }
}