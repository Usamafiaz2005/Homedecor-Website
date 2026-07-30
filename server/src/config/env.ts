
import dotenv from 'dotenv';
dotenv.config();
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@Homedecor.pk',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JC_MERCHANT_ID: process.env.JC_MERCHANT_ID,
  JC_PASSWORD: process.env.JC_PASSWORD,
  JC_INTEGRITY_SALT: process.env.JC_INTEGRITY_SALT,
  JC_ENDPOINT: process.env.JC_ENDPOINT || 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/',
};

// Fail fast on missing secrets
const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
required.forEach(key => {
  if (!env[key as keyof typeof env]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
});

export default env;