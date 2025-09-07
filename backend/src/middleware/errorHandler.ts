import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  if (error instanceof Error) {
    // Handle known error types
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = error.message;
      isOperational = true;
    } else if (error.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID format';
      isOperational = true;
    } else if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
      isOperational = true;
    } else if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
      isOperational = true;
    } else if (error.name === 'MulterError') {
      statusCode = 400;
      message = 'File upload error';
      isOperational = true;
    } else if ('statusCode' in error) {
      // Custom AppError
      statusCode = (error as AppError).statusCode;
      message = error.message;
      isOperational = (error as AppError).isOperational;
    }
  }

  // Log error details
  console.error('Error Details:', {
    message: error.message,
    stack: error.stack,
    statusCode,
    isOperational,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error.message,
    }),
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
