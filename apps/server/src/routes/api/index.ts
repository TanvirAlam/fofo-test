import { Router, Request, Response } from 'express';
import v1Routes from './v1';
import { API_VERSIONS } from 'src/utils/version';

const router: Router = Router();

router.use(`/${API_VERSIONS.V1}`, v1Routes);

router.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Foodime API Server',
    versions: {
      v1: `/api/${API_VERSIONS.V1}`,
    },
    documentation: `/api/${API_VERSIONS.V1}/health`,
  });
});

export default router;
