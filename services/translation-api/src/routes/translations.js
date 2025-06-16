import { Router } from 'express';
import { TranslationController } from '../controllers/TranslationController.js';

const router = Router();
const translationController = new TranslationController();

/**
 * @swagger
 * /api/translations:
 *   post:
 *     summary: Criar uma nova tradução
 *     tags: [Translations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TranslationRequest'
 *     responses:
 *       201:
 *         description: Tradução criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Translation'
 *                 message:
 *                   type: string
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/translations', (req, res) => translationController.createTranslation(req, res));

/**
 * @swagger
 * /api/translations/{id}:
 *   get:
 *     summary: Obter uma tradução por ID
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da tradução
 *     responses:
 *       200:
 *         description: Tradução encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Translation'
 *       404:
 *         description: Tradução não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/translations/:id', (req, res) => translationController.getTranslation(req, res));

/**
 * @swagger
 * /api/translations:
 *   get:
 *     summary: Obter todas as traduções
 *     tags: [Translations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *     responses:
 *       200:
 *         description: Lista de traduções
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     translations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Translation'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/translations', (req, res) => translationController.getAllTranslations(req, res));

export default router;
