import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import RefreshToken from '../models/RefreshToken';
import { generateTokens, setAuthCookies } from '../utils/token';

// @desc Register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      status: 'success',
      data: {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error) { next(error); }
};

// @desc Login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await (user as any).comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      status: 'success',
      data: {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error) { next(error); }
};

// @desc Logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  } catch (error) { next(error); }
};

// @desc Refresh Token
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const stored = await RefreshToken.findOne({ token, revoked: false });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(stored.user);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString());

    await RefreshToken.deleteOne({ token });
    await RefreshToken.create({
      token: newRefreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setAuthCookies(res, accessToken, newRefreshToken);
    res.status(200).json({ status: 'success', message: 'Token refreshed' });
  } catch (error) { next(error); }
};

// @desc Get Me
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) { next(error); }
};

// @desc Get All Users (Admin Only)
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) { next(error); }
};

// @desc Update User Role (Admin Only)
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) { next(error); }
};