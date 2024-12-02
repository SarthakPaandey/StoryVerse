import express, { Request, Response, NextFunction } from 'express';
import { StoryService } from '../services/story/story.service';
import { authenticate } from '../middleware/auth.middleware';
import { QueueService } from '../services/queue/bull.service';
import { WebSocketService } from '../services/websocket/socket.service';

export function createStoryRouter(webSocketService: WebSocketService) {
  const router = express.Router();
  const storyService = new StoryService(webSocketService);
  const queueService = new QueueService();

  router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const story = await storyService.createStory(req.body);
      return res.status(201).json(story);
    } catch (error: any) {
      next(error);
    }
  });

  router.post('/:id/contributions', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body;
      const { id: storyId } = req.params;
      const { userId } = req.user as { userId: string };

      const story = await storyService.addContribution(storyId, userId, content);

      // Queue image generation
      if (story.contributions && story.contributions.length > 0) {
        const lastContribution = story.contributions[story.contributions.length - 1];
        if (lastContribution._id) {
          await queueService.addImageGenerationJob({
            prompt: content,
            storyId,
            contributionId: lastContribution._id.toString()
          });
        }
      }

      return res.status(201).json(story);
    } catch (error: any) {
      next(error);
    }
  });

  return router;
}

export default router;