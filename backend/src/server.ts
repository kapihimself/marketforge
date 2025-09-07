import app from './app';
import { appConfig, pool, redis } from './config/database';

const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    // Test Redis connection
    await redis.ping();
    console.log('✅ Redis connected successfully');

    // Start server
    const server = app.listen(appConfig.port, () => {
      console.log(`🚀 Server running on port ${appConfig.port}`);
      console.log(`📱 Environment: ${appConfig.nodeEnv}`);
      console.log(`🌐 API URL: http://localhost:${appConfig.port}`);
      console.log(`📊 Health Check: http://localhost:${appConfig.port}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('🔌 HTTP server closed');
        
        try {
          await pool.end();
          console.log('🔌 Database connection closed');
          
          await redis.quit();
          console.log('🔌 Redis connection closed');
          
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
