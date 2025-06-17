import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',    info: {
      title: 'Translation Service API',
      version: '1.0.0',
      description: `
        API para serviço de tradução com mensageria.
        ## Códigos de idioma suportados:
      `,
    },    tags: [
      {
        name: 'Translations',
        description: 'Operações relacionadas às traduções de texto'
      },
      {
        name: 'Languages',
        description: 'Operações relacionadas à detecção de idiomas'
      }
    ],
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],    components: {
      schemas: {
        Translation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da tradução',
              example: '550e8400-e29b-41d4-a716-446655440000'
            },
            text: {
              type: 'string',
              description: 'Texto original',
              example: 'Hello, how are you today, Daniel Rossano?'
            },
            translatedText: {
              type: 'string',
              description: 'Texto traduzido',
              example: 'Olá, como você está hoje?'
            },
            sourceLang: {
              type: 'string',
              description: 'Idioma de origem',
              example: 'en'
            },
            targetLang: {
              type: 'string',
              description: 'Idioma de destino',
              example: 'pt'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed'],
              description: 'Status da tradução',
              example: 'completed'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2025-06-16T23:17:04.124Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
              example: '2025-06-16T23:17:05.324Z'
            }
          },
          example: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            text: 'Hello, how are you today?',
            translatedText: 'Olá, como você está hoje?',
            sourceLang: 'en',
            targetLang: 'pt',
            status: 'completed',
            createdAt: '2025-06-16T23:17:04.124Z',
            updatedAt: '2025-06-16T23:17:05.324Z'
          }
        },
        TranslationRequest: {
          type: 'object',
          required: ['text', 'sourceLang', 'targetLang'],
          properties: {
            text: {
              type: 'string',
              description: 'Texto a ser traduzido',
              example: 'Hello, how are you today?'
            },
            sourceLang: {
              type: 'string',
              description: 'Idioma de origem (ISO 639-1)',
              example: 'en',
              enum: ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'ru', 'hi']
            },
            targetLang: {
              type: 'string',
              description: 'Idioma de destino (ISO 639-1)',
              example: 'pt',
              enum: ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'ru', 'hi']
            }
          },
          example: {
            text: 'Hello, how are you today?',
            sourceLang: 'en',
            targetLang: 'pt'
          }        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se a operação foi bem-sucedida',
              example: true
            },
            message: {
              type: 'string',
              description: 'Mensagem descritiva da operação',
              example: 'Tradução criada com sucesso'
            },
            data: {
              type: 'object',
              description: 'Dados retornados pela operação'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se a operação foi bem-sucedida',
              example: false
            },
            message: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Erro de validação dos dados'
            },
            error: {
              type: 'string',
              description: 'Detalhes do erro',
              example: 'Campo "text" é obrigatório'
            }
          },
          example: {
            success: false,
            message: 'Erro de validação dos dados',
            error: 'Campo "text" é obrigatório'
          }
        }
      },
      examples: {
        TranslationRequestExample: {
          summary: 'Exemplo básico de tradução',
          description: 'Exemplo de tradução do inglês para português',
          value: {            text: 'Hello, how are you today?',
            sourceLang: 'en',
            targetLang: 'pt'
          }
        },
        LanguageDetection: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da detecção de idioma',
              example: '550e8400-e29b-41d4-a716-446655440001'
            },
            text: {
              type: 'string',
              description: 'Texto para detecção de idioma',
              example: 'Hello, how are you today?'
            },
            detectedLanguage: {
              type: 'string',
              description: 'Idioma detectado (ISO 639-1)',
              example: 'en'
            },
            confidence: {
              type: 'number',
              format: 'float',
              description: 'Nível de confiança da detecção (0-1)',
              example: 0.98
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed'],
              description: 'Status da detecção',
              example: 'completed'
            },
            provider: {
              type: 'string',
              description: 'Provedor usado para detecção',
              example: 'LibreTranslate'
            },
            errorMessage: {
              type: 'string',
              description: 'Mensagem de erro (se houver)',
              example: null
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2025-06-16T23:17:04.124Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
              example: '2025-06-16T23:17:05.324Z'
            }
          },
          example: {
            id: '550e8400-e29b-41d4-a716-446655440001',
            text: 'Hello, how are you today?',
            detectedLanguage: 'en',
            confidence: 0.98,
            status: 'completed',
            provider: 'LibreTranslate',
            errorMessage: null,
            createdAt: '2025-06-16T23:17:04.124Z',
            updatedAt: '2025-06-16T23:17:05.324Z'
          }
        },
        LanguageDetectionRequest: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              description: 'Texto para detecção de idioma',
              example: 'Hello, how are you today?'
            }
          },
          example: {
            text: 'Hello, how are you today?'
          }
        },
        TranslationRequestSpanish: {
          summary: 'Tradução para espanhol',
          description: 'Exemplo de tradução do inglês para espanhol',
          value: {
            text: 'Good morning, have a great day!',
            sourceLang: 'en',
            targetLang: 'es'
          }
        },        TranslationRequestFrench: {
          summary: 'Tradução para francês',
          description: 'Exemplo de tradução do português para francês',
          value: {
            text: 'Obrigado pela sua ajuda!',
            sourceLang: 'pt',
            targetLang: 'fr'
          }
        },
        LanguageDetectionRequestExample: {
          summary: 'Exemplo básico de detecção de idioma',
          description: 'Exemplo de detecção de idioma em texto em inglês',
          value: {
            text: 'Hello, how are you today?'
          }
        },
        LanguageDetectionRequestPortuguese: {
          summary: 'Detecção de texto em português',
          description: 'Exemplo de detecção de idioma em texto em português',
          value: {
            text: 'Olá, como você está hoje?'
          }
        },
        LanguageDetectionRequestSpanish: {
          summary: 'Detecção de texto em espanhol',
          description: 'Exemplo de detecção de idioma em texto em espanhol',
          value: {
            text: 'Hola, ¿cómo estás hoy?'
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

export const swaggerSpec = swaggerJsDoc(options);
