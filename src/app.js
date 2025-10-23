const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const config = require("./config/config");
const swaggerSpec = require("./config/swagger");
const routes = require("./routes");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const app = express();

// Security middleware - Configure for web UI compatibility
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for dashboard
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
app.use(
  fileUpload({
    limits: { fileSize: config.maxFileSize },
    abortOnLimit: true,
    createParentPath: true,
  })
);

// Logging middleware
if (config.nodeEnv !== "test") {
  app.use(morgan("combined"));
}

// Serve static files (UI) - Fixed for Docker
const path = require('path');
app.use("/static", express.static(path.join(__dirname, '../public')));

// Landing page - Web Dashboard UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Clear storage utility page
app.get("/clear-storage.html", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/clear-storage.html'));
});

// Procurement dashboard page
app.get("/procurement.html", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/procurement.html'));
});

// API Info endpoint
app.get("/api-info", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Supplier Order Management API",
    docs: "/docs",
    health: "/health",
    version: config.apiVersion,
  });
});

// Swagger Documentation UI at /docs
app.use("/docs", swaggerUi.serve);
app.get(
  "/docs",
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Supplier Order Management API - Ryan Indangan",
  })
);

// Swagger JSON endpoint
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: "2.0.0",
    author: "Ryan James Francisco Indangan",
  });
});

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
