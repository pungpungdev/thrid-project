const express = require("express");
const router = express.Router();
const { sendWelcomeMail } = require("../controllers/mailController");

/**
 * @swagger
 * /api/mail/send-welcome:
 *   post:
 *     summary: Send a welcome email to a new user
 *     tags:
 *       - Mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome email sent
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/send-welcome", async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ message: "Email and name are required" });
  }
  try {
    await sendWelcomeMail(email, name);
    res.json({ message: "Welcome email sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
});

module.exports = router;
