import { DataSource } from 'typeorm';
import { Translation } from '../models/Translation.js';
import { LanguageDetection } from '../models/LanguageDetection.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'translation_db',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [Translation, LanguageDetection],
  migrations: ['src/migrations/*.js'],
  subscribers: ['src/subscribers/*.js'],
});
