const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:           { type: integer }
 *                   username:     { type: string }
 *                   firstname:    { type: string }
 *                   lastname:     { type: string }
 *                   telephone:    { type: string }
 *                   email:        { type: string }
 *                   faculties_id: { type: integer }
 *                   majors_id:    { type: integer }
 *                   profile_img:  { type: string }
 *                   role:         { type: boolean }
 *                   actives:      { type: boolean }
 */
router.get('/', userController.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - firstname
 *               - lastname
 *               - telephone
 *               - email
 *               - profile_img
 *               - role
 *               - actives
 *             properties:
 *               username:     { type: string }
 *               password:     { type: string }
 *               firstname:    { type: string }
 *               lastname:     { type: string }
 *               telephone:    { type: string }
 *               email:        { type: string }
 *               faculties_id: { type: integer }
 *               majors_id:    { type: integer }
 *               profile_img:  { type: string }
 *               role:         { type: boolean }
 *               actives:      { type: boolean }
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
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
 *               firstname:    { type: string }
 *               lastname:     { type: string }
 *               telephone:    { type: string }
 *               email:        { type: string }
 *               faculties_id: { type: integer }
 *               majors_id:    { type: integer }
 *               profile_img:  { type: string }
 *               role:         { type: boolean }
 *               actives:      { type: boolean }
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid input
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deactivate (soft delete) a user by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User deactivated
 *       404:
 *         description: User not found
 */
router.delete('/:id', userController.softDeleteUser);

module.exports = router;
