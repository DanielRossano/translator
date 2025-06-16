import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './config/database.js';
import { swaggerSpec } from './config/swagger.js';
import translationRoutes from './routes/translations.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

async function bootstrap() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Create Express application
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Swagger documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: "Translation Service API Documentation"
    }));

    // Health check route
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', service: 'translation-api' });
    });

    // Routes
    app.use('/api', translationRoutes);

    // Error handling middleware
    app.use(notFoundHandler);
    app.use(errorHandler);

    // Start server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API Documentation available at http://localhost:${port}/api-docs`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Closing connections...');
      await AppDataSource.destroy();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received. Closing connections...');
      await AppDataSource.destroy();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap(); 