import { Request, Response, NextFunction } from 'express';
import { extractVersionFromPath, getDeprecationInfo } from '../utils/version';
import { logger } from '../utils/logger';

export function deprecationMiddleware(req: Request, res: Response, next: NextFunction): void {
  const version = extractVersionFromPath(req.path);
  
  if (version) {
    const deprecationInfo = getDeprecationInfo(version);
    
    if (deprecationInfo.deprecated) {
      res.set({
        'X-API-Deprecated': 'true',
        'X-API-Sunset-Date': deprecationInfo.sunsetDate,
        'X-API-Migration-Guide': deprecationInfo.migrationGuide,
        'Warning': `299 - "API ${version} is deprecated. ${deprecationInfo.message}"`,
      });
      
      logger.warn(`Deprecated API ${version} accessed`, {
        path: req.path,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        sunsetDate: deprecationInfo.sunsetDate,
      });
    }
  }
  
  next();
}
