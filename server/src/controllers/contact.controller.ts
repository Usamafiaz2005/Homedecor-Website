import { Request, Response, NextFunction } from 'express';
import { sendEmail } from '../utils/emailTemplates';

export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, message, phone } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }

    await sendEmail({
      to: process.env.EMAIL_FROM!,
      subject: `New contact from ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})<br><strong>Phone:</strong> ${phone || 'N/A'}<br><strong>Message:</strong><br>${message}</p>`
    });

    res.status(200).json({ status: 'success', message: 'Your message has been received.' });
  } catch (error) {
    next(error);
  }
};