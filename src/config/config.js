require('dotenv').config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiVersion: process.env.API_VERSION || 'v1',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'supplier-order-mgmt-secret-key-2024',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Google Gemini AI Configuration
  geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyDwE9AroHeB22TRHsm35e1hotQHKd9XNSE',
  
  // File Upload Configuration
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
  uploadDir: process.env.UPLOAD_DIR || 'uploads'
};

module.exports = config;

