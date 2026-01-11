const express = require("express");
const router = express.Router();
const majorController = require("../controllers/majorController");

/**
 * @swagger
 * tags:
 *   name: Majors
 *   description: Major management APIs
 */

/**
 * @swagger
 * /api/majors:
 *   get:
 *     summary: Get all majors
 *     tags: [Majors]
 *     responses:
 *       200:
 *         description: List of majors
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
 *                   faculty_id:
 *                     type: integer
 */
router.get("/", majorController.getMajors);

/**
 * @swagger
 * /api/majors/{id}:
 *   get:
 *     summary: Get a major by ID
 *     tags: [Majors]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Major ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Major found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 faculty_id:
 *                   type: integer
 *       404:
 *         description: Major not found
 */
router.get("/:id", majorController.getMajorById);

/**
 * @swagger
 * /api/majors:
 *   post:
 *     summary: Create a new major
 *     tags: [Majors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - faculty_id
 *             properties:
 *               name:
 *                 type: string
 *               faculty_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Major created
 *       400:
 *         description: Invalid input
 */
router.post("/", majorController.createMajor);

/**
 * @swagger
 * /api/majors/{id}:
 *   put:
 *     summary: Update a major by ID
 *     tags: [Majors]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Major ID
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
 *               faculty_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Major updated
 *       400:
 *         description: Invalid input
 */
router.put("/:id", majorController.updateMajor);

/**
 * @swagger
 * /api/majors/{id}:
 *   delete:
 *     summary: Delete a major by ID
 *     tags: [Majors]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Major ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Major deleted
 *       404:
 *         description: Major not found
 */
router.delete("/:id", majorController.deleteMajor);

module.exports = router;
