import dotenv from 'dotenv';
import { Pool } from 'pg';
import Redis from 'ioredis';

dotenv.config();

// Database Configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'digital_commerce',
  user: process.env.DB_USER || 'dev',
  password: process.env.DB_PASSWORD || 'dev123',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Redis Configuration
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
};

// Application Configuration
export const appConfig = {
  port: parseInt(process.env.PORT || '8000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600'), // 100MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'pdf', 'epub', 'mobi', 'zip', 'rar', 'mp3', 'mp4', 'avi', 'mov',
    'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'psd', 'ai', 'sketch', 'figma'
  ],
};

// External Services Configuration
export const servicesConfig = {
  // Midtrans Payment Gateway
  midtrans: {
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    snapUrl: process.env.MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js',
  },
  
  // Cloudinary Cloud Storage (Free tier: 25GB)
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true,
  },
  
  // Nodemailer with Gmail SMTP (Free)
  email: {
    service: 'gmail',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '', // Gmail App Password
    fromEmail: process.env.FROM_EMAIL || 'noreply@digitalcommerce.com',
    fromName: process.env.FROM_NAME || 'Digital Commerce Platform',
  },
  
  // Algolia Search (Free tier available)
  algolia: {
    appId: process.env.ALGOLIA_APP_ID || '',
    apiKey: process.env.ALGOLIA_API_KEY || '',
    searchKey: process.env.ALGOLIA_SEARCH_KEY || '',
  },
  
  elasticsearch: {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  },
};

// Rate Limiting Configuration
export const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
};

// Initialize Database Pool
export const pool = new Pool(dbConfig);

// Initialize Redis Client
export const redis = new Redis(redisConfig);

// Handle Redis connection events
redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

// Handle Database connection events
pool.on('connect', () => {
  console.log('✅ PostgreSQL connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

export default {
  dbConfig,
  redisConfig,
  appConfig,
  servicesConfig,
  rateLimitConfig,
  pool,
  redis,
};