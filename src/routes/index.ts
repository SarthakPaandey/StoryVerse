import express from 'express';
import { createStoryRouter } from './story.routes';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import { WebSocketService } from '../services/websocket/socket.service';

export function createRouter(webSocketService: WebSocketService) {
  const router = express.Router();

  router.use('/stories', createStoryRouter(webSocketService));
  router.use('/users', userRoutes);
  router.use('/auth', authRoutes);

  return router;
}

export default createRouter;