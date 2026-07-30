import { Router } from 'express';
import { Request, Response } from 'express';
import Subscriber from '../models/Subscriber';

const router = Router();

router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await Subscriber.findOneAndUpdate(
      { email },
      { email, isActive: true },
      { upsert: true, new: true }
    );
    res.status(200).json({ status: 'success', message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Subscription failed' });
  }
});

export default router;