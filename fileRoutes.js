const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file
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
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post('/upload', upload.single('file'), fileController.uploadFile);

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Get all uploaded files
 *     responses:
 *       200:
 *         description: List of files
 */
router.get('/files', fileController.listFiles);

/**
 * @swagger
 * /api/download/{id}:
 *   get:
 *     summary: Download file by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File download
 */
router.get('/download/:id', fileController.downloadFile);

/**
 * @swagger
 * /api/delete/{id}:
 *   delete:
 *     summary: Delete file by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File deleted
 */
router.delete('/delete/:id', fileController.deleteFile);

module.exports = router;