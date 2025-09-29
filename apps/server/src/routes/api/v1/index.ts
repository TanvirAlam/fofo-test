import { Router } from 'express';
import authRoutes from '../../../modules/auth';
import aiRoutes from '../../../modules/ai';
import userRoutes from '../../../modules/users';
import reviewRoutes from '../../../modules/reviews';
import uploadRoutes from '../../../modules/upload';
import analyticsRoutes from '../../../modules/analytics';
import menuRoutes from '../../../modules/menu';
import orderRoutes from '../../../modules/orders';
import restaurantRoutes from '../../../modules/restaurants';
import notificationRoutes from '../../../modules/notifications';
import rflctRoutes from '../../../modules/rflct';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/upload', uploadRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/notifications', notificationRoutes);
router.use('/rflct', rflctRoutes);

router.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    version: 'v1',
    timestamp: new Date().toISOString(),
  });
});

export default router;
