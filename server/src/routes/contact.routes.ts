import { Router } from 'express';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import env from '../config/env';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: env.EMAIL_USER,
      to: env.EMAIL_USER,
      subject: `Contact Form: ${name}`,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b> ${message}</p>`,
    });
    res.status(200).json({ status: 'success', message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

export default router;