import mongoose from 'mongoose';
import app from './app';
import env from './config/env';
import dotenv from "dotenv";
dotenv.config();
const startServer = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

startServer();