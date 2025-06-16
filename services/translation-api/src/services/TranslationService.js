import { AppDataSource } from '../config/database.js';
import { Translation } from '../models/Translation.js';
import { RabbitMQService } from './RabbitMQService.js';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const translationRequestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  sourceLang: z.string().min(2, 'Source language is required'),
  targetLang: z.string().min(2, 'Target language is required')
});

export class TranslationService {
  constructor() {
    this.translationRepository = AppDataSource.getRepository(Translation);
    this.rabbitMQService = new RabbitMQService();
  }

  async createTranslation(data) {
    // Validate input
    const validatedData = translationRequestSchema.parse(data);

    // Create translation record
    const translation = new Translation();
    translation.id = uuidv4();
    translation.text = validatedData.text;
    translation.sourceLang = validatedData.sourceLang;
    translation.targetLang = validatedData.targetLang;
    translation.status = 'pending';

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
}
