const express = require('express')
const reviewController = require('../controllers/reviewsController')
const authController = require('../controllers/authController')
const router = express.Router({ mergeParams: true })

/**
 * @swagger
 * tags:
 *   name: Reviews
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Get all reviews
 *   post:
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review:
 *                 type: string
 *               rating:
 *                 type: number
 *               tour:
 *                 type: string
 *               user:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Get single review
 *   patch:
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               review:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Review updated successfully
 *   delete:
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted successfully
 */

router.use(authController.protectAll)

router.route('/')
.get(reviewController.getAllReviews)
.post(authController.restrictTo('user'), reviewController.setTourUserId, reviewController.createReview)


router.route('/:id')
.delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview)
.patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
.get(reviewController.getReview)


module.exports = router