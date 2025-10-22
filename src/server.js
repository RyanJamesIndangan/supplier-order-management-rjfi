const app = require('./app');
const config = require('./config/config');

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log('===========================================');
  console.log(`🚀 Server running in ${config.nodeEnv} mode`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api/${config.apiVersion}`);
  console.log('===========================================');
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Received shutdown signal, closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forcing shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

