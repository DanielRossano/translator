import dotenv from 'dotenv';
import { AppDataSource } from './config/database.js';
import { TranslationWorker } from './workers/TranslationWorker.js';

dotenv.config();

async function bootstrap() {
  try {
    console.log('Starting Translation Worker...');

    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Initialize and start the worker
    const worker = new TranslationWorker();
    await worker.start();

  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
}

bootstrap(); 