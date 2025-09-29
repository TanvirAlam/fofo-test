import express, { Router } from 'express';
const router: Router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant routes - Coming soon',
    data: null,
  });
});

export default router;
