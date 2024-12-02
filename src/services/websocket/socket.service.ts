import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../../utils/logger';

export class WebSocketService {
  private io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    this.initializeHandlers();
  }

  private initializeHandlers(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      socket.on('join_story', (storyId: string) => {
        socket.join(`story:${storyId}`);
      });

      socket.on('leave_story', (storyId: string) => {
        socket.leave(`story:${storyId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public emitStoryUpdate(storyId: string, data: any): void {
    this.io.to(`story:${storyId}`).emit('story_updated', data);
  }

  public emitNewContribution(storyId: string, data: any): void {
    this.io.to(`story:${storyId}`).emit('new_contribution', data);
  }
}