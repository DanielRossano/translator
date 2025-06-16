import { TranslationService } from '../services/TranslationService.js';

export class TranslationController {
  constructor() {
    this.translationService = new TranslationService();
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
}
