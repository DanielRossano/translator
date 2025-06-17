import { Router } from 'express';
import { TranslationController } from '../controllers/TranslationController.js';

const router = Router();
const translationController = new TranslationController();

/**
 * @swagger
 * /api/translations:
 *   post:
 *     summary: Criar uma nova tradução
 *     description: Cria uma nova solicitação de tradução que será processada de forma assíncrona
 *     tags: [Translations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TranslationRequest'
 *           examples:
 *             basicExample:
 *               $ref: '#/components/examples/TranslationRequestExample'
 *             spanishExample:
 *               $ref: '#/components/examples/TranslationRequestSpanish'
 *             frenchExample:
 *               $ref: '#/components/examples/TranslationRequestFrench'
 *     responses:
 *       201:
 *         description: Tradução criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Translation'
 *             example:
 *               success: true
 *               message: 'Tradução criada com sucesso'
 *               data:
 *                 id: '550e8400-e29b-41d4-a716-446655440000'
 *                 text: 'Hello, how are you today?'
 *                 translatedText: null
 *                 sourceLang: 'en'
 *                 targetLang: 'pt'
 *                 status: 'pending'
 *                 createdAt: '2025-06-16T23:17:04.124Z'
 *                 updatedAt: '2025-06-16T23:17:04.124Z'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Erro de validação dos dados'
 *               error: 'Campo "text" é obrigatório'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Erro interno do servidor'
 *               error: 'Falha na conexão com o banco de dados'
 */
router.post('/translations', (req, res) => translationController.createTranslation(req, res));
router.post('/detections', (req, res) => translationController.createLanguageDetection(req, res));

/**
 * @swagger
 * /api/translations/{id}:
 *   get:
 *     summary: Obter uma tradução por ID
 *     description: Recupera os detalhes de uma tradução específica usando seu ID
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da tradução
 *         example: '550e8400-e29b-41d4-a716-446655440000'
 *     responses:
 *       200:
 *         description: Tradução encontrada
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Translation'
 *             example:
 *               success: true
 *               message: 'Tradução encontrada'
 *               data:
 *                 id: '550e8400-e29b-41d4-a716-446655440000'
 *                 text: 'Hello, how are you today?'
 *                 translatedText: 'Olá, como você está hoje?'
 *                 sourceLang: 'en'
 *                 targetLang: 'pt'
 *                 status: 'completed'
 *                 createdAt: '2025-06-16T23:17:04.124Z'
 *                 updatedAt: '2025-06-16T23:17:05.324Z'
 *       404:
 *         description: Tradução não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Tradução não encontrada'
 *               error: 'Nenhuma tradução encontrada com o ID fornecido'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/translations/:id', (req, res) => translationController.getTranslation(req, res));
router.get('/detections/:id', (req, res) => translationController.getLanguageDetection(req, res));

/**
 * @swagger
 * /api/translations:
 *   get:
 *     summary: Obter todas as traduções
 *     description: Lista todas as traduções com paginação
 *     tags: [Translations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de itens por página
 *         example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['pending', 'processing', 'completed', 'failed']
 *         description: Filtrar por status da tradução
 *         example: 'completed'
 *     responses:
 *       200:
 *         description: Lista de traduções
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         translations:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Translation'
 *                         total:
 *                           type: integer
 *                           description: Total de traduções
 *                         page:
 *                           type: integer
 *                           description: Página atual
 *                         totalPages:
 *                           type: integer
 *                           description: Total de páginas
 *             example:
 *               success: true
 *               message: 'Traduções recuperadas com sucesso'
 *               data:
 *                 translations:
 *                   - id: '550e8400-e29b-41d4-a716-446655440000'
 *                     text: 'Hello, how are you today?'
 *                     translatedText: 'Olá, como você está hoje?'
 *                     sourceLang: 'en'
 *                     targetLang: 'pt'
 *                     status: 'completed'
 *                     createdAt: '2025-06-16T23:17:04.124Z'
 *                     updatedAt: '2025-06-16T23:17:05.324Z'
 *                   - id: '650e8400-e29b-41d4-a716-446655440001'
 *                     text: 'Good morning!'
 *                     translatedText: 'Buenos días!'
 *                     sourceLang: 'en'
 *                     targetLang: 'es'
 *                     status: 'completed'
 *                     createdAt: '2025-06-16T23:15:04.124Z'
 *                     updatedAt: '2025-06-16T23:15:06.324Z'
 *                 total: 25
 *                 page: 1
 *                 totalPages: 3
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/translations', (req, res) => translationController.getAllTranslations(req, res));
router.get('/detections', (req, res) => translationController.getAllLanguageDetections(req, res));



/**
 * @swagger
 * /api/detections:
 *   post:
 *     summary: Criar uma nova detecção de idioma (assíncrono)
 *     description: Cria uma nova solicitação de detecção de idioma que será processada de forma assíncrona
 *     tags: [Languages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             spanishExample:
 *               $ref: '#/components/examples/LanguageDetectionSpanish'
 *             portugueseExample:
 *               summary: 'Detectar idioma português'
 *               description: 'Exemplo de detecção de idioma português'
 *               value:
 *                 text: 'Bom dia! Como você está?'
 *     responses:
 *       201:
 *         description: Detecção de idioma criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LanguageDetection'
 *             example:
 *               success: true
 *               message: 'Detecção de idioma criada com sucesso'
 *               data:
 *                 id: '550e8400-e29b-41d4-a716-446655440000'
 *                 text: 'Bonjour, comment allez-vous?'
 *                 detectedLanguage: null
 *                 confidence: null
 *                 status: 'pending'
 *                 provider: null
 *                 errorMessage: null
 *                 createdAt: '2025-06-16T23:17:04.124Z'
 *                 updatedAt: '2025-06-16T23:17:04.124Z'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/detections', (req, res) => translationController.createLanguageDetection(req, res));

/**
 * @swagger
 * /api/detections/{id}:
 *   get:
 *     summary: Obter uma detecção de idioma por ID
 *     description: Recupera os detalhes de uma detecção de idioma específica usando seu ID
 *     tags: [Languages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da detecção de idioma
 *         example: '550e8400-e29b-41d4-a716-446655440000'
 *     responses:
 *       200:
 *         description: Detecção de idioma encontrada
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LanguageDetection'
 *             example:
 *               success: true
 *               message: 'Detecção de idioma encontrada'
 *               data:
 *                 id: '550e8400-e29b-41d4-a716-446655440000'
 *                 text: 'Bonjour, comment allez-vous?'
 *                 detectedLanguage: 'fr'
 *                 confidence: 0.95
 *                 status: 'completed'
 *                 provider: 'MyMemory'
 *                 errorMessage: null
 *                 createdAt: '2025-06-16T23:17:04.124Z'
 *                 updatedAt: '2025-06-16T23:17:05.324Z'
 *       404:
 *         description: Detecção de idioma não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/detections/:id', (req, res) => translationController.getLanguageDetection(req, res));

/**
 * @swagger
 * /api/detections:
 *   get:
 *     summary: Obter todas as detecções de idioma
 *     description: Lista todas as detecções de idioma com paginação
 *     tags: [Languages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['pending', 'processing', 'completed', 'failed']
 *         description: Filtrar por status da detecção
 *     responses:
 *       200:
 *         description: Lista de detecções de idioma
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         detections:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/LanguageDetection'
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/detections', (req, res) => translationController.getAllLanguageDetections(req, res));

// Language Detection Endpoints

/**
 * @swagger
 * /api/detections:
 *   post:
 *     summary: Criar uma nova detecção de idioma (assíncrono)
 *     description: Cria uma nova solicitação de detecção de idioma que será processada de forma assíncrona
 *     tags: [Languages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LanguageDetectionRequest'
 *           examples:
 *             basicExample:
 *               $ref: '#/components/examples/LanguageDetectionRequestExample'
 *             portugueseExample:
 *               $ref: '#/components/examples/LanguageDetectionRequestPortuguese'
 *             spanishExample:
 *               $ref: '#/components/examples/LanguageDetectionRequestSpanish'
 *     responses:
 *       201:
 *         description: Detecção de idioma criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LanguageDetection'
 *             example:
 *               success: true
 *               message: 'Detecção de idioma criada com sucesso'
 *               data:
 *                 id: '550e8400-e29b-41d4-a716-446655440001'
 *                 text: 'Hello, how are you today?'
 *                 detectedLanguage: null
 *                 confidence: null
 *                 status: 'pending'
 *                 provider: null
 *                 errorMessage: null
 *                 createdAt: '2025-06-16T23:17:04.124Z'
 *                 updatedAt: '2025-06-16T23:17:04.124Z'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Dados inválidos'
 *               error: 'Campo "text" é obrigatório'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Erro interno do servidor'
 *               error: 'Falha na conexão com o banco de dados'
 */
// router.post('/detections', (req, res) => languageDetectionController.create(req, res));

/**
 * @swagger
 * /api/detections:
 *   get:
 *     summary: Obter todas as detecções de idioma
 *     description: Retorna uma lista paginada de todas as detecções de idioma
 *     tags: [Languages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de itens por página
 *         example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, failed]
 *         description: Filtrar por status da detecção
 *         example: completed
 *       - in: query
 *         name: detectedLanguage
 *         schema:
 *           type: string
 *         description: Filtrar por idioma detectado (ISO 639-1)
 *         example: en
 *     responses:
 *       200:
 *         description: Lista de detecções de idioma retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         detections:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/LanguageDetection'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                               example: 1
 *                             limit:
 *                               type: integer
 *                               example: 10
 *                             total:
 *                               type: integer
 *                               example: 25
 *                             totalPages:
 *                               type: integer
 *                               example: 3
 *             example:
 *               success: true
 *               message: 'Detecções de idioma encontradas'
 *               data:
 *                 detections:
 *                   - id: '550e8400-e29b-41d4-a716-446655440001'
 *                     text: 'Hello, how are you today?'
 *                     detectedLanguage: 'en'
 *                     confidence: 0.98
 *                     status: 'completed'
 *                     provider: 'LibreTranslate'
 *                     errorMessage: null
 *                     createdAt: '2025-06-16T23:17:04.124Z'
 *                     updatedAt: '2025-06-16T23:17:05.324Z'
 *                   - id: '550e8400-e29b-41d4-a716-446655440002'
 *                     text: 'Olá, como você está?'
 *                     detectedLanguage: 'pt'
 *                     confidence: 0.95
 *                     status: 'completed'
 *                     provider: 'LibreTranslate'
 *                     errorMessage: null
 *                     createdAt: '2025-06-16T23:15:04.124Z'
 *                     updatedAt: '2025-06-16T23:15:05.324Z'
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 25
 *                   totalPages: 3
 *       400:
 *         description: Parâmetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Parâmetros inválidos'
 *               error: 'O parâmetro "page" deve ser um número positivo'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Erro interno do servidor'
 *               error: 'Falha na conexão com o banco de dados'
 */
// router.get('/detections', (req, res) => languageDetectionController.getAll(req, res));

/**
 * @swagger
 * /api/detections/{id}:
 *   get:
 *     summary: Obter uma detecção de idioma por ID
 *     description: Retorna os detalhes de uma detecção de idioma específica pelo seu ID
 *     tags: [Languages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único da detecção de idioma
 *         example: '550e8400-e29b-41d4-a716-446655440001'
 *     responses:
 *       200:
 *         description: Detecção de idioma encontrada
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LanguageDetection'
 *             example:
 *               success: true
 *               message: 'Detecção de idioma encontrada'
 *               data:
 *                 id: '550e8400-e29b-41d4-a716-446655440001'
 *                 text: 'Hello, how are you today?'
 *                 detectedLanguage: 'en'
 *                 confidence: 0.98
 *                 status: 'completed'
 *                 provider: 'LibreTranslate'
 *                 errorMessage: null
 *                 createdAt: '2025-06-16T23:17:04.124Z'
 *                 updatedAt: '2025-06-16T23:17:05.324Z'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'ID inválido'
 *               error: 'ID deve ser um UUID válido'
 *       404:
 *         description: Detecção de idioma não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Detecção de idioma não encontrada'
 *               error: 'Nenhuma detecção de idioma encontrada com o ID fornecido'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 'Erro interno do servidor'
 *               error: 'Falha na conexão com o banco de dados'
 */
// router.get('/detections/:id', (req, res) => languageDetectionController.getById(req, res));

export default router;
