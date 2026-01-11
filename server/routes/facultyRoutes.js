const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

/**
 * @swagger
 * tags:
 *   name: Faculties
 *   description: Faculty management APIs
 */

/**
 * @swagger
 * /api/faculties:
 *   get:
 *     summary: Get all faculties
 *     tags: [Faculties]
 *     responses:
 *       200:
 *         description: List of faculties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/', facultyController.getFaculties);

/**
 * @swagger
 * /api/faculties/{id}:
 *   get:
 *     summary: Get a faculty by ID
 *     tags: [Faculties]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Faculty ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Faculty found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Faculty not found
 */
router.get('/:id', facultyController.getFacultyById);

/**
 * @swagger
 * /api/faculties:
 *   post:
 *     summary: Create a new faculty
 *     tags: [Faculties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Faculty created
 *       400:
 *         description: Invalid input
 */
router.post('/', facultyController.createFaculty);

/**
 * @swagger
 * /api/faculties/{id}:
 *   put:
 *     summary: Update a faculty by ID
 *     tags: [Faculties]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Faculty ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Faculty updated
 *       400:
 *         description: Invalid input
 */
router.put('/:id', facultyController.updateFaculty);

/**
 * @swagger
 * /api/faculties/{id}:
 *   delete:
 *     summary: Delete a faculty by ID
 *     tags: [Faculties]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Faculty ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Faculty deleted
 *       404:
 *         description: Faculty not found
 */
router.delete('/:id', facultyController.deleteFaculty);

module.exports = router;
