import { AppDataSource } from '../config/database.js';
import { Translation } from '../models/Translation.js';
import { MyMemoryService } from './MyMemoryService.js';

export class TranslationService {
  constructor() {
    this.translationRepository = AppDataSource.getRepository(Translation);
    this.translationService = new MyMemoryService();
  }

  async processTranslation(translationData) {
    const { id, text, sourceLang, targetLang } = translationData;

    try {
      console.log(`🔄 Processing translation ${id}: "${text.substring(0, 30)}..." (${sourceLang} → ${targetLang})`);

      // Update status to processing
      await this.updateTranslationStatus(id, 'processing');      // Perform translation using MyMemory
      const translatedText = await this.translationService.translateText(
        text,
        sourceLang,
        targetLang
      );

      // Update with completed status and result
      await this.updateTranslationStatus(id, 'completed', translatedText);

      console.log(`✅ Translation ${id} completed successfully: "${translatedText.substring(0, 30)}..."`);
      
      return {
        id,
        originalText: text,
        translatedText,
        sourceLang,
        targetLang,
        status: 'completed'
      };

    } catch (error) {
      console.error(`❌ Translation ${id} failed:`, error.message);
      
      // Update status to failed with error message
      await this.updateTranslationStatus(id, 'failed', null, error.message);
      
      throw error;
    }
  }
  async updateTranslationStatus(id, status, translatedText = null, errorMessage = null) {
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

  /**
   * Verificar saúde do serviço de tradução
   */
  async healthCheck() {
    try {
      const testResult = await this.libreTranslateService.translateText(
        'Hello',
        'en',
        'pt'
      );
      
      return {
        status: 'healthy',
        service: 'LibreTranslate',
        testTranslation: testResult
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'LibreTranslate',
        error: error.message
      };
    }
  }
}
