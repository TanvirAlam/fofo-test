import express, { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'User routes - Coming soon',
    data: null,
  });
});

export default router;
