import jwt from 'jsonwebtoken';
import { Response } from 'express';
import env from '../config/env';

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ('none' as const) : ('lax' as const),
  };

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
};