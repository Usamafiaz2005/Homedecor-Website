import dns from 'dns';
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (_) {}
import mongoose from 'mongoose';
import app from './app';
import env from './config/env';

const startServer = async () => {
  try {
    if (!env.MONGO_URI) {
      console.warn('⚠️ MONGO_URI is missing. Server will not connect to MongoDB until configured.');
    } else {
      try {
        await mongoose.connect(env.MONGO_URI, {
          serverSelectionTimeoutMS: 5000,
          autoIndex: env.NODE_ENV !== 'production',
        });
        console.log('✅ MongoDB Atlas Connected Successfully');
      } catch (dbError) {
        console.warn('⚠️ Warning: MongoDB connection failed:', (dbError as any)?.message || dbError);
        console.warn('⚠️ Server is running on port ' + (env.PORT || 5000) + ' (database operations will wait/fail until valid MONGO_URI is reachable).');
      }
    }

    const PORT = env.PORT || 5000;

    // Bind explicitly to 0.0.0.0 for Render proxy routing
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Production server running on host 0.0.0.0:${PORT}`);
    });

    // Graceful shutdown handling for Render zero-downtime deployments
    const gracefulShutdown = (signal: string) => {
      console.log(`\n⚠️ ${signal} received. Shutting down HTTP server gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        if (mongoose.connection.readyState === 1) {
          await mongoose.connection.close(false);
          console.log('MongoDB connection closed.');
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Server startup failure:', error);
    process.exit(1);
  }
};

startServer();