import { AppDataSource } from '../config/database.js';
import { Translation } from '../models/Translation.js';
import { GoogleTranslationService } from './GoogleTranslationService.js';

export class TranslationService {
  constructor() {
    this.translationRepository = AppDataSource.getRepository(Translation);
    this.googleTranslationService = new GoogleTranslationService();
  }

  async processTranslation(translationData) {
    const { id, text, sourceLang, targetLang } = translationData;

    try {
      console.log(`Processing translation ${id}`);

      // Update status to processing
      await this.updateTranslationStatus(id, 'processing');

      // Perform translation
      const translatedText = await this.googleTranslationService.translateText(
        text,
        sourceLang,
        targetLang
      );

      // Update with completed status and result
      await this.updateTranslationStatus(id, 'completed', translatedText);

      console.log(`Translation ${id} completed successfully`);
    } catch (error) {
      console.error(`Translation ${id} failed:`, error);
      
      // Update status to failed
      await this.updateTranslationStatus(id, 'failed');
      
      throw error;
    }
  }

  async updateTranslationStatus(id, status, translatedText = null) {
    const translation = await this.translationRepository.findOne({
      where: { id }
    });

    if (!translation) {
      throw new Error(`Translation with id ${id} not found`);
    }

    translation.status = status;
    if (translatedText) {
      translation.translatedText = translatedText;
    }

    return await this.translationRepository.save(translation);
  }
}
