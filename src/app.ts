import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { WebSocketService } from './services/websocket/socket.service';
import { errorHandler } from './middleware/error.middleware';
import { connectDatabase } from './database/connection';
import { TelegramBotService } from './services/telegram/bot.service';
import { RedisService } from './services/cache/redis.service';
import { QueueService } from './services/queue/bull.service';
import routes from './routes';
import { logger } from './utils/logger';
import { createRouter } from './routes/index';

export class Application {
  private app: express.Application;
  private server: http.Server;
  private webSocketService: WebSocketService;
  private telegramBot: TelegramBotService;
  private redisService: RedisService;
  private queueService: QueueService;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.webSocketService = new WebSocketService(this.server);
    this.telegramBot = new TelegramBotService(this.webSocketService);
    this.redisService = new RedisService();
    this.queueService = new QueueService();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    });
    this.app.use(limiter);
  }

  private setupErrorHandling(): void {
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
      errorHandler(err, req, res, next);
    });
  }

  private setupRoutes(): void {
    this.app.use('/api', createRouter(this.webSocketService));
  }

  public async start(): Promise<void> {
    try {
      // Connect to MongoDB
      await connectDatabase();

      // Start Telegram bot
      await this.telegramBot.start();

      // Start Express server
      const PORT = process.env.PORT || 3000;
      this.server.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      logger.error('Application startup error:', error);
      process.exit(1);
    }
  }
}