import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Translation Service API',
      version: '1.0.0',
      description: 'API para serviço de tradução com mensageria',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Translation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da tradução'
            },
            text: {
              type: 'string',
              description: 'Texto original'
            },
            translatedText: {
              type: 'string',
              description: 'Texto traduzido'
            },
            sourceLang: {
              type: 'string',
              description: 'Idioma de origem'
            },
            targetLang: {
              type: 'string',
              description: 'Idioma de destino'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed'],
              description: 'Status da tradução'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização'
            }
          }
        },
        TranslationRequest: {
          type: 'object',
          required: ['text', 'sourceLang', 'targetLang'],
          properties: {
            text: {
              type: 'string',
              description: 'Texto a ser traduzido'
            },
            sourceLang: {
              type: 'string',
              description: 'Idioma de origem (ex: en, pt, es)'
            },
            targetLang: {
              type: 'string',
              description: 'Idioma de destino (ex: en, pt, es)'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

export const swaggerSpec = swaggerJsDoc(options);
