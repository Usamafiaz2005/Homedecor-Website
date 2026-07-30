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
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@homedecore.homes',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JC_MERCHANT_ID: process.env.JC_MERCHANT_ID,
  JC_PASSWORD: process.env.JC_PASSWORD,
  JC_INTEGRITY_SALT: process.env.JC_INTEGRITY_SALT,
  JC_ENDPOINT: process.env.JC_ENDPOINT || 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/',
};

// Fail-fast environment variable validation with clear error logging for Render/Vercel deployments
const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
const missing = required.filter((key) => !env[key as keyof typeof env]);

if (missing.length > 0) {
  console.error('\n❌ [DEPLOYMENT ERROR] Missing required environment variables:');
  missing.forEach((key) => console.error(`   - ${key}`));
  console.error('Please configure these variables in your Render Dashboard Environment settings.\n');
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export default env;