import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';

import { config, corsOrigins } from './index';
import { morganStream } from '../utils/logger';
import { basicRateLimiter } from '../middleware/rateLimit';
import { DEVELOPMENT } from '../utils/constant';
import routes from '../routes';

export class AppConfig {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(
      helmet({
        contentSecurityPolicy: config.NODE_ENV === DEVELOPMENT ? false : true,
      })
    );

    this.app.use(
      cors({
        origin: corsOrigins,
        credentials: true,
      })
    );

    this.app.use(basicRateLimiter);
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());
    this.app.use(morgan('combined', { stream: morganStream }));
    this.app.use(
      '/uploads',
      express.static(path.join(__dirname, '../uploads'))
    );
    this.app.use('/public', express.static(path.join(__dirname, '../public')));

    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });
  }

  private initializeRoutes(): void {
    this.app.use(routes);
  }

  public getApp(): Application {
    return this.app;
  }
}
