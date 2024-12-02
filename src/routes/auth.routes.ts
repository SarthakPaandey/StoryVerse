import express from 'express';
import { AuthService } from '../services/auth/auth.service';

const router = express.Router();
const authService = new AuthService();

router.post('/telegram', async (req, res) => {
  try {
    const result = await authService.authenticateTelegramUser(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;