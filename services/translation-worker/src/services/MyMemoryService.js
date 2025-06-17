import axios from 'axios';

export class MyMemoryService {
  constructor() {
    this.baseUrl = 'https://api.mymemory.translated.net';
    this.timeout = 10000; // 10 segundos
    this.apiKey = process.env.MYMEMORY_API_KEY || null; // Opcional, melhora os limites
    
    // Cache de idiomas suportados
    this.supportedLanguages = [
      { code: 'en', name: 'English' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
      { code: 'nl', name: 'Dutch' },
      { code: 'sv', name: 'Swedish' },
      { code: 'da', name: 'Danish' },
      { code: 'no', name: 'Norwegian' },
      { code: 'fi', name: 'Finnish' },
      { code: 'pl', name: 'Polish' },
      { code: 'cs', name: 'Czech' },
      { code: 'tr', name: 'Turkish' }
    ];
  }

  /**
   * Fazer requisição com retry
   */
  async makeRequest(url, params, retries = 2) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log(`📡 MyMemory request attempt ${attempt + 1}: ${url}`);
        
        const config = {
          timeout: this.timeout,
          params: {
            ...params,
            ...(this.apiKey && { key: this.apiKey })
          },
          headers: {
            'User-Agent': 'TranslatorApp/1.0'
          }
        };

        const response = await axios.get(url, config);
        
        if (response.data && response.data.responseStatus === 200) {
          return response.data;
        } else {
          throw new Error(response.data?.responseDetails || 'API response error');
        }
      } catch (error) {
        console.error(`❌ MyMemory attempt ${attempt + 1} failed:`, error.message);
        
        if (attempt < retries - 1) {
          await this.delay(1000 * (attempt + 1)); // Backoff progressivo
        } else {
          throw error;
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

      // MyMemory tem limite de 500 caracteres por requisição
      if (text.length > 500) {
        return await this.translateLongText(text, sourceLang, targetLang);
      }

      console.log(`🔄 Translating "${text.substring(0, 50)}..." from ${sourceLang} to ${targetLang}`);
      
      const langPair = `${sourceLang}|${targetLang}`;
      
      const params = {
        q: text,
        langpair: langPair
      };

      const result = await this.makeRequest(`${this.baseUrl}/get`, params);
      
      const translatedText = result.responseData.translatedText;
      
      console.log(`✅ Translation completed: "${translatedText.substring(0, 50)}..."`);
      
      return translatedText;

    } catch (error) {
      console.error('MyMemory translation error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  /**
   * Traduzir texto longo (dividindo em chunks)
   */
  async translateLongText(text, sourceLang, targetLang) {
    const chunks = this.splitText(text, 450); // Margem de segurança
    const translatedChunks = [];

    console.log(`📝 Translating long text in ${chunks.length} chunks`);

    for (let i = 0; i < chunks.length; i++) {
      try {
        const chunk = chunks[i];
        const translated = await this.translateText(chunk, sourceLang, targetLang);
        translatedChunks.push(translated);
        
        // Pequena pausa entre chunks para não sobrecarregar a API
        if (i < chunks.length - 1) {
          await this.delay(500);
        }
      } catch (error) {
        console.error(`Error translating chunk ${i + 1}:`, error);
        translatedChunks.push(chunks[i]); // Fallback para texto original
      }
    }

    return translatedChunks.join(' ');
  }

  /**
   * Dividir texto em chunks menores
   */
  splitText(text, maxLength) {
    const chunks = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      
      if (currentChunk.length + trimmedSentence.length + 1 <= maxLength) {
        currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk + '.');
        }
        currentChunk = trimmedSentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk + '.');
    }
    
    return chunks.length > 0 ? chunks : [text];
  }
  /**
   * Detectar idioma do texto (funcionalidade limitada no MyMemory)
   */
  async detectLanguage(text) {
    try {
      if (!text || text.trim().length === 0) {
        return {
          detectedLanguage: 'en',
          confidence: 0.1
        };
      }
      const result = this.simpleLanguageDetection(text);
      
      console.log(`🎯 Detected language (heuristic): ${result.detectedLanguage} (confidence: ${result.confidence})`);
      
      return result;
    } catch (error) {
      console.error('Language detection error:', error);
      return {
        detectedLanguage: 'en',
        confidence: 0.1
      }; // Fallback para inglês
    }
  }

  /**
   * Detecção simples de idioma baseada em padrões
   */
  simpleLanguageDetection(text) {
    const lowerText = text.toLowerCase();
    const textLength = text.length;
    
    // Padrões simples para alguns idiomas
    const patterns = {
      'pt': /\b(e|de|da|do|dos|das|para|com|uma|um|você|vocês|não|que|mais|muito|também|já|seu|sua|seus|suas|ele|ela|eles|elas|este|esta|isto|esse|essa|isso|aquele|aquela|aquilo|quando|onde|como|por|porque|então|mas|porém|contudo|todavia|entretanto|ainda|sempre|nunca|talvez|talvez|bem|mal|melhor|pior|bom|boa|ruim|grande|pequeno|novo|velho|jovem|antigo|primeiro|último|hoje|amanhã|ontem|agora|depois|antes|durante|sempre|nunca|às|vezes|muitas|poucas|todas|todos|nenhum|nenhuma|algum|alguma|qualquer|cada|toda|todo|outro|outra|outros|outras|mesmo|mesma|próprio|própria)\b/g,
      'es': /\b(y|de|la|el|los|las|para|con|una|un|usted|ustedes|no|que|más|muy|también|ya|su|sus|él|ella|ellos|ellas|este|esta|esto|ese|esa|eso|aquel|aquella|aquello|cuando|donde|como|por|porque|entonces|pero|sin|embargo|aún|siempre|nunca|quizás|bien|mal|mejor|peor|bueno|buena|malo|mala|grande|pequeño|nuevo|viejo|joven|antiguo|primero|último|hoy|mañana|ayer|ahora|después|antes|durante|siempre|nunca|a|veces|muchas|pocas|todas|todos|ningún|ninguna|algún|alguna|cualquier|cada|toda|todo|otro|otra|otros|otras|mismo|misma|propio|propia)\b/g,
      'fr': /\b(et|de|la|le|les|pour|avec|une|un|vous|ne|pas|que|plus|très|aussi|déjà|votre|vos|il|elle|ils|elles|ce|cette|cet|ces|celui|celle|ceux|celles|quand|où|comment|par|parce|alors|mais|sans|cependant|encore|toujours|jamais|peut-être|bien|mal|mieux|pire|bon|bonne|mauvais|mauvaise|grand|grande|petit|petite|nouveau|nouvelle|vieux|vieille|jeune|ancien|ancienne|premier|première|dernier|dernière|aujourd|demain|hier|maintenant|après|avant|pendant|toujours|jamais|quelquefois|beaucoup|peu|toutes|tous|aucun|aucune|quelque|chaque|toute|tout|autre|même|propre)\b/g,
      'de': /\b(und|der|die|das|den|dem|des|für|mit|eine|ein|sie|nicht|dass|mehr|sehr|auch|schon|ihr|ihre|er|es|wir|ihr|dieser|diese|dieses|jener|jene|jenes|wann|wo|wie|durch|weil|dann|aber|ohne|jedoch|noch|immer|nie|vielleicht|gut|schlecht|besser|schlechter|groß|große|klein|kleine|neu|neue|alt|alte|jung|erste|ersten|letzten|heute|morgen|gestern|jetzt|nach|vor|während|immer|nie|manchmal|viele|wenige|alle|kein|keine|einige|jeder|jede|jedes|ganz|andere|anderen|selbst|eigen|eigene)\b/g,
      'it': /\b(e|di|la|il|lo|gli|le|per|con|una|un|lei|non|che|più|molto|anche|già|suo|sua|suoi|sue|lui|essa|essi|esse|questo|questa|quello|quella|quando|dove|come|da|perché|allora|ma|senza|tuttavia|ancora|sempre|mai|forse|bene|male|meglio|peggio|buono|buona|cattivo|cattiva|grande|piccolo|piccola|nuovo|nuova|vecchio|vecchia|giovane|primo|prima|ultimo|ultima|oggi|domani|ieri|ora|dopo|prima|durante|sempre|mai|qualche|volta|molte|poche|tutte|tutti|nessun|nessuna|alcuni|alcune|ogni|tutta|tutto|altro|altra|altri|altre|stesso|stessa|proprio|propria)\b/g,
      'en': /\b(and|the|of|to|for|with|a|an|you|not|that|more|very|also|already|your|he|she|it|we|they|this|that|these|those|when|where|how|by|because|then|but|without|however|still|always|never|maybe|good|bad|better|worse|big|small|new|old|young|first|last|today|tomorrow|yesterday|now|after|before|during|always|never|sometimes|many|few|all|none|some|any|each|every|whole|other|same|own)\b/g,
    };
    
    let maxMatches = 0;
    let detectedLang = 'en';
    let totalWords = (text.match(/\b\w+\b/g) || []).length;
    
    for (const [lang, pattern] of Object.entries(patterns)) {
      const matches = (lowerText.match(pattern) || []).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedLang = lang;
      }
    }
    
    // Calcular confiança baseada na proporção de palavras reconhecidas
    const confidence = totalWords > 0 ? Math.min(maxMatches / totalWords, 0.95) : 0.1;
    
    // Se não tivemos matches suficientes, tentar detectar por caracteres especiais
    if (confidence < 0.2) {
      if (/[àáâãäåèéêëìíîïòóôõöùúûüýÿç]/i.test(text)) {
        if (/[ãõç]/i.test(text)) {
          return { detectedLanguage: 'pt', confidence: 0.7 };
        } else if (/[ñ]/i.test(text)) {
          return { detectedLanguage: 'es', confidence: 0.7 };
        } else if (/[àéèêç]/i.test(text)) {
          return { detectedLanguage: 'fr', confidence: 0.6 };
        }
      }
      
      if (/[äöüß]/i.test(text)) {
        return { detectedLanguage: 'de', confidence: 0.7 };
      }
      
      if (/[а-яё]/i.test(text)) {
        return { detectedLanguage: 'ru', confidence: 0.8 };
      }
      
      if (/[一-龯]/i.test(text)) {
        return { detectedLanguage: 'zh', confidence: 0.8 };
      }
      
      if (/[ひらがなカタカナ]/i.test(text)) {
        return { detectedLanguage: 'ja', confidence: 0.8 };
      }
      
      if (/[가-힣]/i.test(text)) {
        return { detectedLanguage: 'ko', confidence: 0.8 };
      }
      
      if (/[ا-ي]/i.test(text)) {
        return { detectedLanguage: 'ar', confidence: 0.8 };
      }
    }
    
    return {
      detectedLanguage: detectedLang,
      confidence: Math.max(confidence, 0.1)
    };
  }

  /**
   * Obter idiomas suportados
   */
  async getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
