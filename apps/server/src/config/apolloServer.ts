import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Application } from 'express';
import { logger } from '../utils/logger';
import { corsOrigins } from './index';

export class ApolloServer {
  public httpServer: HttpServer;
  public io: SocketIOServer;

  constructor(app: Application) {
    this.httpServer = createServer(app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: corsOrigins,
        methods: ['GET', 'POST'],
      },
    });
  }

  public initializeSocketIO(): void {
    this.io.on('connection', socket => {
      logger.info(`Socket connected: ${socket.id}`);
      socket.on('join-user', (userId: string) => {
        socket.join(`user-${userId}`);
        logger.debug(`User ${userId} joined their room`);
      });

      socket.on('join-order', (orderId: string) => {
        socket.join(`order-${orderId}`);
        logger.debug(`Socket joined order room: ${orderId}`);
      });

      socket.on('ai-message', data => {
        socket.to(`chat-${data.chatId}`).emit('ai-message', data);
      });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  public start(port: number, callback: () => void): void {
    this.httpServer.listen(port, callback);
  }

  public async close(): Promise<void> {
    return new Promise<void>(resolve => {
      this.httpServer.close(() => {
        logger.info('HTTP server closed');
        resolve();
      });

      this.io.close(() => {
        logger.info('Socket.IO server closed');
      });
    });
  }
}
