const express = require("express");
const router = express.Router();
const annualCourseController = require("../controllers/annualCourseController");

/**
 * @swagger
 * tags:
 *   name: AnnualCourse
 *   description: AnnualCourse management
 */

/**
 * @swagger
 * /api/annual-courses:
 *   post:
 *     summary: Create a new annual course
 *     tags: [AnnualCourse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: The created annual course
 */
router.post("/", annualCourseController.createAnnualCourse);

/**
 * @swagger
 * /api/annual-courses:
 *   get:
 *     summary: Get all annual courses
 *     tags: [AnnualCourse]
 *     responses:
 *       200:
 *         description: List of annual courses
 */
router.get("/", annualCourseController.getAllAnnualCourses);

/**
 * @swagger
 * /api/annual-courses/{id}:
 *   get:
 *     summary: Get annual course by ID
 *     tags: [AnnualCourse]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Annual course ID
 *     responses:
 *       200:
 *         description: Annual course data
 *       404:
 *         description: Not found
 */
router.get("/:id", annualCourseController.getAnnualCourseById);

/**
 * @swagger
 * /api/annual-courses/{id}:
 *   put:
 *     summary: Update annual course by ID
 *     tags: [AnnualCourse]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Annual course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: The updated annual course
 */
router.put("/:id", annualCourseController.updateAnnualCourse);

/**
 * @swagger
 * /api/annual-courses/{id}:
 *   delete:
 *     summary: Delete annual course by ID
 *     tags: [AnnualCourse]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Annual course ID
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:id", annualCourseController.deleteAnnualCourse);

/**
 * @swagger
 * /api/annual-courses/{id}:
 *   patch:
 *     summary: Active annual course by ID
 *     tags: [AnnualCourse]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Annual course ID
 *     responses:
 *       200:
 *         description: Actived
 */
router.patch("/active/:id", annualCourseController.activeAnuualCourse);

/**
 * @swagger
 * tags:
 *   name: AnnualCourseSubject
 *   description: AnnualCourseSubject management
 */

/**
 * @swagger
 * /api/annual-courses/subject:
 *   post:
 *     summary: Create a new annual course subject
 *     tags: [AnnualCourseSubject]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: The created annual course subject
 */
router.post("/subject", annualCourseController.createAnnualCourseSubject);

/**
 * @swagger
 * /api/annual-courses/subject:
 *   get:
 *     summary: Get all annual course subjects
 *     tags: [AnnualCourseSubject]
 *     responses:
 *       200:
 *         description: List of annual course subjects
 */
router.get("/subject", annualCourseController.getAllAnnualCourseSubjects);

/**
 * @swagger
 * /api/annual-courses/subject/{id}:
 *   get:
 *     summary: Get annual course subject by ID
 *     tags: [AnnualCourseSubject]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Annual course subject ID
 *     responses:
 *       200:
 *         description: Annual course subject data
 *       404:
 *         description: Not found
 */
router.get("/subject/:id", annualCourseController.getAnnualCourseSubjectById);

/**
 * @swagger
 * /api/annual-courses/subject/{id}:
 *   put:
 *     summary: Update annual course subject by ID
 *     tags: [AnnualCourseSubject]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Annual course subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: The updated annual course subject
 */
router.put("/subject/:id", annualCourseController.updateAnnualCourseSubject);

/**
 * @swagger
 * /api/annual-courses/subject/{id}:
 *   delete:
 *     summary: Delete annual course subject by ID
 *     tags: [AnnualCourseSubject]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Annual course subject ID
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/subject/:id", annualCourseController.deleteAnnualCourseSubject);

/**
 * @swagger
 * /api/annual-courses/subject-by-annual-course/{id}:
 *   delete:
 *     summary: Delete annual course subject by annual course ID
 *     tags: [AnnualCourseSubject]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Annual course subject ID
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/subject-by-annual-course/:id", annualCourseController.deleteAnnualCourseSubjectByAnnualCourseId);

module.exports = router;
