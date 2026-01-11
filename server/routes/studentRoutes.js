const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management APIs
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:            { type: integer }
 *                   student_id:    { type: string }
 *                   username:      { type: string }
 *                   firstname_th:  { type: string }
 *                   lastname_th:   { type: string }
 *                   faculties_id:  { type: integer }
 *                   majors_id:     { type: integer }
 *                   email:         { type: string }
 *                   certificate:   { type: string }
 *                   actives:       { type: boolean }
 */
router.get('/', studentController.getStudents);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Student ID
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student found
 *       404:
 *         description: Student not found
 */
router.get('/:id', studentController.getStudentById);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - username
 *               - password
 *               - firstname_th
 *               - lastname_th
 *               - email
 *               - certificate
 *               - faculties_id
 *               - majors_id
 *               - actives
 *             properties:
 *               student_id:   { type: string }
 *               username:     { type: string }
 *               password:     { type: string }
 *               title_th:     { type: boolean }
 *               firstname_th: { type: string }
 *               lastname_th:  { type: string }
 *               email:        { type: string }
 *               certificate:  { type: string }
 *               faculties_id: { type: integer }
 *               majors_id:    { type: integer }
 *               actives:      { type: boolean }
 *     responses:
 *       201:
 *         description: Student created
 *       400:
 *         description: Invalid input
 */
router.post('/', studentController.createStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student by ID
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:     { type: string }
 *               password:     { type: string }
 *               firstname_th: { type: string }
 *               lastname_th:  { type: string }
 *               email:        { type: string }
 *               certificate:  { type: string }
 *               faculties_id: { type: integer }
 *               majors_id:    { type: integer }
 *               actives:      { type: boolean }
 *     responses:
 *       200:
 *         description: Student updated
 *       400:
 *         description: Invalid input
 */
router.put('/:id', studentController.updateStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Deactivate (soft delete) a student by ID
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Student deactivated
 *       404:
 *         description: Student not found
 */
router.delete('/:id', studentController.softDeleteStudent);

module.exports = router;
