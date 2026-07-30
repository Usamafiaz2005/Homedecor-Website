import { Request, Response, NextFunction } from 'express';
import env from '../config/env';

/**
 * Global Error Handler Middleware
 * Centralized secure error management
 */

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default Status
  let statusCode = err.statusCode || 500;

  /**
   * Internal Logging
   * Replace console.error with Winston / Datadog / Sentry in production
   */
  console.error(
    `[Security Log Alert] ${new Date().toISOString()} | ${req.method} ${
      req.originalUrl
    } | ${err.name}: ${err.message}`
  );

  /**
   * Mongoose Validation Error
   */
  if (err.name === 'ValidationError') {
    statusCode = 400;

    return res.status(statusCode).json({
      success: false,
      status: 'error',
      message:
        'The provided data contains invalid values.',
    });
  }

  /**
   * Mongo Duplicate Key Error
   */
  if (err.code === 11000) {
    statusCode = 409;

    const duplicateField = Object.keys(
      err.keyValue || {}
    )[0];

    return res.status(statusCode).json({
      success: false,
      status: 'error',
      message: `${duplicateField} already exists.`,
    });
  }

  /**
   * Invalid Mongo ObjectId
   */
  if (err.name === 'CastError') {
    statusCode = 400;

    return res.status(statusCode).json({
      success: false,
      status: 'error',
      message:
        'Invalid resource identifier provided.',
    });
  }

  /**
   * JWT Errors
   */
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;

    return res.status(statusCode).json({
      success: false,
      status: 'error',
      message:
        'Authentication token is invalid.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;

    return res.status(statusCode).json({
      success: false,
      status: 'error',
      message:
        'Authentication token has expired.',
    });
  }

  /**
   * Multer Upload Errors
   */
  if (err.name === 'MulterError') {
    statusCode = 400;

    return res.status(statusCode).json({
      success: false,
      status: 'error',
      message:
        'File upload failed due to invalid upload configuration.',
    });
  }

  /**
   * Production Safe Error Response
   */
  const productionMessage =
    'An unexpected error occurred. Our team has been notified.';

  /**
   * Final Response
   */
  res.status(statusCode).json({
    success: false,
    status: 'error',

    message:
      statusCode === 500 &&
      env.NODE_ENV === 'production'
        ? productionMessage
        : err.message || 'Server Error',

    ...(env.NODE_ENV === 'development' && {
      stack: err.stack,
      errorName: err.name,
    }),
  });
};