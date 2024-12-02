import express, { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user/user.service';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const userService = new UserService();

router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.json(user);
  } catch (error: any) {
    next(error);
  }
});

export default router;