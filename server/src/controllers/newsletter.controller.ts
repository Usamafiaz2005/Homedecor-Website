import { Request, Response, NextFunction } from 'express';
import Subscriber from '../models/Subscriber';

export const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(200).json({ message: 'Already subscribed!' });

    await Subscriber.create({ email });
    res.status(201).json({ status: 'success', message: 'Successfully subscribed.' });
  } catch (error) {
    next(error);
  }
};