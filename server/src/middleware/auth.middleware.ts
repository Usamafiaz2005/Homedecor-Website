import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';

interface TokenPayload {
  id: string;
  role: string;
}

// Extend Express Request safely
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

/**
 * Protect Middleware
 * Validates JWT access token
 * Attaches user metadata to request context
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies?.accessToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  // No token
  if (!token) {
    return res.status(401).json({
      success: false,
      message:
        'Access denied. Authorization token missing.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    ) as TokenPayload;

    // Attach user metadata
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    // Token expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authorization token expired.',
      });
    }

    // Invalid token
    return res.status(401).json({
      success: false,
      message:
        'Authorization verification failed.',
    });
  }
};

/**
 * Admin Authorization Middleware
 */
export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !req.user ||
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message:
        'Access forbidden. Administrative permissions required.',
    });
  }

  next();
};

/**
 * Resource Ownership Verification
 * Prevents BOLA / IDOR attacks
 */
export const verifyResourceOwnership = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Admin bypass
  if (req.user?.role === 'admin') {
    return next();
  }

  // Target resource owner
  const targetUserId =
    req.params.userId ||
    req.body.userId ||
    req.query.userId;

  // Ownership mismatch
  if (
    !targetUserId ||
    req.user?.id !== targetUserId
  ) {
    return res.status(403).json({
      success: false,
      message:
        'Access denied. You do not own this resource.',
    });
  }

  next();
};