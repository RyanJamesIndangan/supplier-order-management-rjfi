const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Supplier Order Management API',
      version: '2.0.0',
      description: `
# AI-Powered Supplier Offer Processing System

Built by **Ryan James Francisco Indangan** for efficient supplier offer management and intelligent product matching.

## Key Features
- 🤖 **AI-Powered Product Matching** - Uses Google Gemini for semantic understanding
- 📤 **File Upload** - Accept supplier offers in Excel/CSV formats
- 🔐 **JWT Authentication** - Secure API access
- 📊 **Smart Matching** - Handles naming variations and SKU differences
- 🎯 **Data Enrichment** - Identifies missing product information
- 📈 **Dashboard** - Review and approve matched offers

## Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini API
- **Authentication**: JWT tokens
- **File Processing**: XLSX parser
- **Deployment**: Docker + Docker Compose

## Getting Started
1. Authenticate using \`/api/v1/auth/login\` or \`/api/v1/auth/register\`
2. Upload supplier offers via \`/api/v1/offers/upload\`
3. Review AI-matched results in \`/api/v1/offers/matches\`
4. Approve/reject matches and export data

For detailed documentation, see README.md
      `,
      contact: {
        name: 'Ryan James Francisco Indangan',
        email: 'ryan@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            status: {
              type: 'integer',
              example: 400
            },
            message: {
              type: 'string',
              example: 'Error description'
            }
          }
        },
        Supplier: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000'
            },
            name: {
              type: 'string',
              example: 'Tech Supplies Inc.'
            },
            contactInfo: {
              type: 'object',
              properties: {
                email: { type: 'string', example: 'contact@techsupplies.com' },
                phone: { type: 'string', example: '+1-555-0100' },
                address: { type: 'string', example: '123 Tech St, CA' }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string',
              example: 'Wireless Mouse'
            },
            sku: {
              type: 'string',
              example: 'WM-2024-001'
            },
            category: {
              type: 'string',
              example: 'Electronics'
            },
            specs: {
              type: 'object',
              example: { color: 'Black', connectivity: 'Wireless' }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization'
      },
      {
        name: 'Suppliers',
        description: 'Supplier management operations'
      },
      {
        name: 'Products',
        description: 'Product catalog management'
      },
      {
        name: 'Offers',
        description: 'Supplier offer processing and matching'
      },
      {
        name: 'File Upload',
        description: 'Upload and process supplier offer files'
      },
      {
        name: 'Dashboard',
        description: 'Analytics and review dashboard'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

