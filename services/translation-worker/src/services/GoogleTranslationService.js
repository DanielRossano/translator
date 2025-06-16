import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

export class GoogleTranslationService {
  constructor() {
    this.translateClient = new Translate({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });
  }

  async translateText(text, sourceLang, targetLang) {
    try {
      console.log(`Translating text from ${sourceLang} to ${targetLang}`);
      
      const [translation] = await this.translateClient.translate(text, {
        from: sourceLang,
        to: targetLang,
      });

      console.log('Translation completed successfully');
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  async detectLanguage(text) {
    try {
      const [detection] = await this.translateClient.detect(text);
      return detection.language;
    } catch (error) {
      console.error('Language detection error:', error);
      throw new Error(`Language detection failed: ${error.message}`);
    }
  }

  async getSupportedLanguages() {
    try {
      const [languages] = await this.translateClient.getLanguages();
      return languages;
    } catch (error) {
      console.error('Error getting supported languages:', error);
      throw new Error(`Failed to get supported languages: ${error.message}`);
    }
  }
}
