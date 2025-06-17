import { AppDataSource } from '../config/database.js';
import { Translation } from '../models/Translation.js';
import { LanguageDetection } from '../models/LanguageDetection.js';
import { RabbitMQService } from './RabbitMQService.js';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const translationRequestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  sourceLang: z.string().min(2, 'Source language is required'),
  targetLang: z.string().min(2, 'Target language is required')
});

const languageDetectionRequestSchema = z.object({
  text: z.string().min(1, 'Text is required')
});

export class TranslationService {
  constructor() {
    this.translationRepository = AppDataSource.getRepository(Translation);
    this.languageDetectionRepository = AppDataSource.getRepository(LanguageDetection);
    this.rabbitMQService = new RabbitMQService();
  }
  async createTranslation(data) {
    // Validate input
    const validatedData = translationRequestSchema.parse(data);

    // Create translation record using repository
    const translation = this.translationRepository.create({
      id: uuidv4(),
      text: validatedData.text,
      sourceLang: validatedData.sourceLang,
      targetLang: validatedData.targetLang,
      status: 'pending'
    });

    // Save to database
    const savedTranslation = await this.translationRepository.save(translation);

    // Send to queue for processing
    await this.rabbitMQService.publishTranslationJob({
      id: savedTranslation.id,
      text: savedTranslation.text,
      sourceLang: savedTranslation.sourceLang,
      targetLang: savedTranslation.targetLang
    });

    return savedTranslation;
  }

  async getTranslation(id) {
    const translation = await this.translationRepository.findOne({
      where: { id }
    });

    if (!translation) {
      throw new Error('Translation not found');
    }

    return translation;
  }

  async getAllTranslations(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [translations, total] = await this.translationRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return {
      translations,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
  async updateTranslationStatus(id, status, translatedText = null) {
    const translation = await this.getTranslation(id);
    
    translation.status = status;
    if (translatedText) {
      translation.translatedText = translatedText;
    }

    return await this.translationRepository.save(translation);
  }

  // Language Detection Methods
  async createLanguageDetection(data) {
    // Validate input
    const validatedData = languageDetectionRequestSchema.parse(data);

    // Create language detection record
    const detection = this.languageDetectionRepository.create({
      id: uuidv4(),
      text: validatedData.text,
      status: 'pending'
    });

    // Save to database
    const savedDetection = await this.languageDetectionRepository.save(detection);

    // Send to queue for processing
    await this.rabbitMQService.publishLanguageDetectionJob({
      id: savedDetection.id,
      text: savedDetection.text
    });

    return savedDetection;
  }

  async getLanguageDetection(id) {
    const detection = await this.languageDetectionRepository.findOne({
      where: { id }
    });

    if (!detection) {
      throw new Error('Language detection not found');
    }

    return detection;
  }

  async getAllLanguageDetections(page = 1, limit = 10, status = null) {
    const skip = (page - 1) * limit;
    
    const queryOptions = {
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    };

    if (status) {
      queryOptions.where = { status };
    }
    
    const [detections, total] = await this.languageDetectionRepository.findAndCount(queryOptions);

    return {
      detections,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async updateLanguageDetectionStatus(id, status, detectedLanguage = null, confidence = null, provider = null, errorMessage = null) {
    const detection = await this.getLanguageDetection(id);
    
    detection.status = status;
    if (detectedLanguage) {
      detection.detectedLanguage = detectedLanguage;
    }
    if (confidence !== null) {
      detection.confidence = confidence;
    }
    if (provider) {
      detection.provider = provider;
    }
    if (errorMessage) {
      detection.errorMessage = errorMessage;
    }

    return await this.languageDetectionRepository.save(detection);
  }
}
