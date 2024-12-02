import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { User } from '../../database/schemas/user.schema';
import { logger } from '../../utils/logger';

export class AuthService {
  async authenticateTelegramUser(telegramData: any) {
    try {
      let user = await User.findOne({ telegramId: telegramData.id });
      
      if (!user) {
        user = await User.create({
          telegramId: telegramData.id,
          username: telegramData.username,
          createdAt: new Date()
        });
      }

      const token = jwt.sign(
        { userId: user._id, telegramId: user.telegramId },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      return { user, token };
    } catch (error) {
      logger.error('Authentication error:', error);
      throw error;
    }
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      logger.error('Token verification error:', error);
      throw error;
    }
  }
}