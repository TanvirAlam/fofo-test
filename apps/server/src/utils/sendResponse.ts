import { Response } from 'express';

export type ResponseStatus = 'success' | 'error';

export const sendResponse = (
  res: Response,
  status: ResponseStatus,
  statusCode: number,
  message: string,
  data?: Record<string, any>
) => {
  return res.status(statusCode).json({
    status,
    statusCode,
    message,
    data: data || {},
  });
};
