const express = require('express');
const router = express.Router();
const {
  uploadOfferFile,
  getUploadedFiles,
  getFileMatches,
  updateMatchStatus,
  getDashboard
} = require('../controllers/uploadController');
const { authenticate, optionalAuth } = require('../middlewares/auth');

/**
 * @swagger
 * /api/v1/upload:
 *   post:
 *     tags: [File Upload]
 *     summary: Upload supplier offer file (Excel/CSV)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel or CSV file containing supplier offers
 *     responses:
 *       201:
 *         description: File uploaded and processing started
 */
// PROTECTED: Requires authentication
router.post('/', authenticate, uploadOfferFile);

/**
 * @swagger
 * /api/v1/upload/files:
 *   get:
 *     tags: [File Upload]
 *     summary: Get all uploaded files
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of uploaded files
 */
// PROTECTED: Requires authentication
router.get('/files', authenticate, getUploadedFiles);

/**
 * @swagger
 * /api/v1/upload/files/{fileId}/matches:
 *   get:
 *     tags: [File Upload]
 *     summary: Get AI-matched results for uploaded file
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: Matched offers with statistics
 */
// PROTECTED: Requires authentication
router.get('/files/:fileId/matches', authenticate, getFileMatches);

/**
 * @swagger
 * /api/v1/upload/matches/{matchId}/status:
 *   put:
 *     tags: [File Upload]
 *     summary: Approve or reject a match
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected, pending]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Match status updated
 */
// PROTECTED: Requires authentication
router.put('/matches/:matchId/status', authenticate, updateMatchStatus);

/**
 * @swagger
 * /api/v1/upload/dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics and recent files
 */
// PROTECTED: Requires authentication
router.get('/dashboard', authenticate, getDashboard);

module.exports = router;

