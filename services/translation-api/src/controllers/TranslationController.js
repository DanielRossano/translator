import { TranslationService } from '../services/TranslationService.js';
import { LibreTranslateService } from '../services/LibreTranslateService.js';

export class TranslationController {
  constructor() {
    this.translationService = new TranslationService();
    this.libreTranslateService = new LibreTranslateService();
  }

  async createTranslation(req, res) {
    try {
      const translation = await this.translationService.createTranslation(req.body);
      res.status(201).json({
        success: true,
        data: translation,
        message: 'Translation request created successfully'
      });
    } catch (error) {
      console.error('Error creating translation:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create translation request'
      });
    }
  }

  async getTranslation(req, res) {
    try {
      const { id } = req.params;
      const translation = await this.translationService.getTranslation(id);
      
      res.json({
        success: true,
        data: translation
      });
    } catch (error) {
      console.error('Error getting translation:', error);
      
      if (error.message === 'Translation not found') {
        return res.status(404).json({
          success: false,
          error: 'Translation not found'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to get translation'
      });
    }
  }

  async getAllTranslations(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await this.translationService.getAllTranslations(page, limit);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting translations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get translations'
      });
    }
  }

  async getSupportedLanguages(req, res) {
    try {
      const languages = await this.libreTranslateService.getSupportedLanguages();
      
      res.json({
        success: true,
        data: {
          languages,
          total: languages.length,
          provider: 'LibreTranslate'
        }
      });
    } catch (error) {
      console.error('Error getting supported languages:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get supported languages'
      });
    }
  }
  async detectLanguage(req, res) {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'Text is required'
        });
      }

      const detectedLanguage = await this.libreTranslateService.detectLanguage(text);
      
      res.json({
        success: true,
        data: {
          detectedLanguage,
          text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
          provider: 'LibreTranslate'
        }
      });
    } catch (error) {
      console.error('Error detecting language:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to detect language'
      });
    }
  }

  async createLanguageDetection(req, res) {
    try {
      const detection = await this.translationService.createLanguageDetection(req.body);
      res.status(201).json({
        success: true,
        data: detection,
        message: 'Language detection request created successfully'
      });
    } catch (error) {
      console.error('Error creating language detection:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create language detection request'
      });
    }
  }

  async getLanguageDetection(req, res) {
    try {
      const { id } = req.params;
      const detection = await this.translationService.getLanguageDetection(id);
      
      res.json({
        success: true,
        data: detection
      });
    } catch (error) {
      console.error('Error getting language detection:', error);
      
      if (error.message === 'Language detection not found') {
        return res.status(404).json({
          success: false,
          error: 'Language detection not found'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to get language detection'
      });
    }
  }

  async getAllLanguageDetections(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;
      
      const result = await this.translationService.getAllLanguageDetections(page, limit, status);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error getting language detections:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get language detections'
      });
    }
  }

  async healthCheck(req, res) {
    try {
      const health = await this.libreTranslateService.healthCheck();
      
      res.json({
        success: true,
        data: health
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        success: false,
        error: 'Health check failed'
      });
    }
  }
}
