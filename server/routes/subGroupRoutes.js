const express = require('express');
const router = express.Router();
const subGroupController = require('../controllers/subGroupController');

/**
 * @swagger
 * tags:
 *   name: SubGroup
 *   description: Subgroup management
 */

/**
 * @swagger
 * /api/sub-groups:
 *   get:
 *     summary: Get all subgroups
 *     tags: [SubGroup]
 *     responses:
 *       200:
 *         description: A list of subgroups
 */

router.get("/", subGroupController.getSubGroups);

module.exports = router;