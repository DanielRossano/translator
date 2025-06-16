import axios from 'axios';

export class LibreTranslateService {
  constructor() {
    // URLs disponíveis do LibreTranslate (públicas e gratuitas)
    this.servers = [
      process.env.LIBRETRANSLATE_URL || 'https://libretranslate.de',
      'https://translate.terraprint.co',
      'https://translate.astian.org',
      'https://libretranslate.com'
    ];
    
    this.currentServerIndex = 0;
    this.apiKey = process.env.LIBRETRANSLATE_API_KEY || null;
    this.timeout = 30000; // 30 segundos
    
    // Cache de idiomas suportados para evitar chamadas desnecessárias
    this.supportedLanguages = null;
    this.languageCache = new Map();
  }

  /**
   * Obter URL do servidor atual
   */
  getCurrentServer() {
    return this.servers[this.currentServerIndex];
  }

  /**
   * Trocar para próximo servidor em caso de falha
   */
  switchToNextServer() {
    this.currentServerIndex = (this.currentServerIndex + 1) % this.servers.length;
    console.log(`🔄 Switching to server: ${this.getCurrentServer()}`);
  }

  /**
   * Fazer requisição com retry automático entre servidores
   */
  async makeRequest(endpoint, data, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const url = `${this.getCurrentServer()}${endpoint}`;
        
        const config = {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'TranslatorApp/1.0'
          }
        };

        // Adicionar API key se disponível
        if (this.apiKey) {
          data.api_key = this.apiKey;
        }

        console.log(`📡 Request to: ${url}`);
        const response = await axios.post(url, data, config);
        
        return response.data;
      } catch (error) {
        console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);
        
        if (attempt < retries - 1) {
          this.switchToNextServer();
          await this.delay(1000 * (attempt + 1)); // Backoff progressivo
        } else {
          throw new Error(`All translation servers failed. Last error: ${error.message}`);
        }
      }
    }
  }

  /**
   * Traduzir texto
   */
  async translateText(text, sourceLang, targetLang) {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text to translate cannot be empty');
      }

      console.log(`🔄 Translating "${text.substring(0, 50)}..." from ${sourceLang} to ${targetLang}`);
      
      // Validar idiomas
      await this.validateLanguages(sourceLang, targetLang);

      const data = {
        q: text,
        source: sourceLang === 'auto' ? 'auto' : sourceLang,
        target: targetLang,
        format: 'text'
      };

      const result = await this.makeRequest('/translate', data);
      
      const translatedText = result.translatedText;
      
      console.log(`✅ Translation completed: "${translatedText.substring(0, 50)}..."`);
      
      return {
        translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        originalText: text,
        provider: 'LibreTranslate',
        server: this.getCurrentServer()
      };

    } catch (error) {
      console.error('LibreTranslate error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  /**
   * Detectar idioma do texto
   */
  async detectLanguage(text) {
    try {
      if (!text || text.trim().length === 0) {
        return 'auto';
      }

      console.log(`🔍 Detecting language for: "${text.substring(0, 30)}..."`);

      const data = { q: text };
      const result = await this.makeRequest('/detect', data);
      
      const detectedLang = result[0]?.language || 'auto';
      const confidence = result[0]?.confidence || 0;
      
      console.log(`🎯 Detected language: ${detectedLang} (confidence: ${confidence})`);
      
      return detectedLang;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'auto'; // Fallback para auto-detecção
    }
  }

  /**
   * Obter idiomas suportados
   */
  async getSupportedLanguages() {
    try {
      if (this.supportedLanguages) {
        return this.supportedLanguages;
      }

      console.log('📋 Fetching supported languages...');
      
      const result = await this.makeRequest('/languages', {});
      
      this.supportedLanguages = result.map(lang => ({
        code: lang.code,
        name: lang.name
      }));
      
      console.log(`✅ Loaded ${this.supportedLanguages.length} supported languages`);
      
      return this.supportedLanguages;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      
      // Fallback com idiomas mais comuns
      return [
        { code: 'auto', name: 'Detect Language' },
        { code: 'en', name: 'English' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ru', name: 'Russian' }
      ];
    }
  }

  /**
   * Validar se os idiomas são suportados
   */
  async validateLanguages(sourceLang, targetLang) {
    const supportedLanguages = await this.getSupportedLanguages();
    const supportedCodes = supportedLanguages.map(lang => lang.code);
    
    if (sourceLang !== 'auto' && !supportedCodes.includes(sourceLang)) {
      throw new Error(`Source language '${sourceLang}' is not supported`);
    }
    
    if (!supportedCodes.includes(targetLang)) {
      throw new Error(`Target language '${targetLang}' is not supported`);
    }
  }

  /**
   * Verificar se o serviço está disponível
   */
  async healthCheck() {
    try {
      const languages = await this.getSupportedLanguages();
      return {
        status: 'healthy',
        server: this.getCurrentServer(),
        supportedLanguages: languages.length,
        provider: 'LibreTranslate'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        server: this.getCurrentServer(),
        provider: 'LibreTranslate'
      };
    }
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
