import { Application } from './app';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    const app = new Application();
    await app.start();
  } catch (error) {
    logger.error('Bootstrap error:', error);
    process.exit(1);
  }
}

bootstrap();