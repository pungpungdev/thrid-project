const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login user
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", adminController.login);

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/logout", adminController.logout);

/**
 * @swagger
 * /api/admin/profile:
 *   get:
 *     summary: Get current logged-in user (protected)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Current user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *       401:
 *         description: Not authenticated
 */
router.get("/profile", adminController.authenticate, (req, res) => {
  res.json({ user: req.session.user });
});

router.patch("/updatePassword", adminController.updatePassword);

module.exports = router;
