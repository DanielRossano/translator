import { AppDataSource } from '../config/database.js';
import { LanguageDetection } from '../models/LanguageDetection.js';
import { MyMemoryService } from './MyMemoryService.js';

export class LanguageDetectionService {
  constructor() {
    this.languageDetectionRepository = AppDataSource.getRepository(LanguageDetection);
    this.myMemoryService = new MyMemoryService();
  }

  async processLanguageDetection(detectionData) {
    const { id, text } = detectionData;

    try {
      console.log(`Processing language detection for ID: ${id}`);

      // Update status to processing
      await this.updateDetectionStatus(id, 'processing');

      // Detect language using MyMemory service
      const result = await this.myMemoryService.detectLanguage(text);

      // Update with successful result
      await this.updateDetectionStatus(
        id,
        'completed',
        result.detectedLanguage,
        result.confidence,
        'MyMemory'
      );

      console.log(`Language detection completed for ID: ${id}, detected: ${result.detectedLanguage}`);

    } catch (error) {
      console.error(`Language detection failed for ID: ${id}:`, error);

      // Update status to failed with error message
      await this.updateDetectionStatus(
        id,
        'failed',
        null,
        null,
        'MyMemory',
        error.message
      );
    }
  }

  async updateDetectionStatus(id, status, detectedLanguage = null, confidence = null, provider = null, errorMessage = null) {
    const detection = await this.languageDetectionRepository.findOne({
      where: { id }
    });

    if (!detection) {
      throw new Error(`Language detection with ID ${id} not found`);
    }

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
