import nodemailer from 'nodemailer';
import env from '../config/env';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS }
});

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  await transporter.sendMail({
    from: `"Homedecor" <${env.EMAIL_FROM}>`,
    to,
    subject,
    html
  });
};

export const orderConfirmationEmail = (orderNumber: string, customerName: string, items: any[]) => `
  <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h1 style="color: #4E342E;">Order Confirmed</h1>
    <p>Dear ${customerName},</p>
    <p>Your order <strong>#${orderNumber}</strong> has been confirmed.</p>
    <table width="100%" cellpadding="8" style="border-collapse: collapse;">
      ${items.map(i => `<tr><td>${i.title}</td><td>×${i.qty}</td><td>Rs. ${i.pricePKR.toLocaleString()}</td></tr>`).join('')}
    </table>
    <p style="color: #4E342E; font-style: italic;">Homedecor — Crafted in Lahore</p>
  </div>
`;