const express = require('express');
const toursController = require('../controllers/toursController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

/**
 * @swagger
 * /tours:
 *   get:
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: List of all tours
 *   post:
 *     tags: [Tours]
 *     responses:
 *       201:
 *         description: Tour created successfully
 */
router
  .route('/')
  .get(toursController.getAllTours)
  .post(
    authController.protectAll,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.createTour
  );

/**
 * @swagger
 * /tours/{id}:
 *   get:
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single tour
 *   patch:
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Tour updated successfully
 *   delete:
 *     tags: [Tours]
 *     responses:
 *       204:
 *         description: Tour deleted successfully
 */
router
  .route('/:id')
  .get(toursController.getSingleTour)
  .patch(
    authController.protectAll,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.uploadTourImages,
    toursController.resizeTourImages,
    toursController.editTour
  )
  .delete(
    authController.protectAll,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.deleteTour
  );

/**
 * @swagger
 * /tours/tour-stats:
 *   get:
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Returns statistics like average ratings, price, etc.
 */
router.route('/tour-stats').get(toursController.getTourStats);

/**
 * @swagger
 * /tours/monthly-plan/{year}:
 *   get:
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Monthly plan data
 */
router
  .route('/monthly-plan/:year')
  .get(
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    toursController.getMonthlyPlan
  );

/**
 * @swagger
 * /tours/tours-within/{distance}/center/{latlng}/unit/{unit}:
 *   get:
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: distance
 *         schema:
 *           type: number
 *         required: true
 *       - in: path
 *         name: latlng
 *         schema:
 *           type: string
 *         required: true
 *         description: Latitude and longitude (format: lat,lng)
 *       - in: path
 *         name: unit
 *         schema:
 *           type: string
 *           enum: [mi, km]
 *         required: true
 *     responses:
 *       200:
 *         description: List of tours within the given distance
 */
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(toursController.getToursWithin);

/**
 * @swagger
 * /tours/distances/{latlng}/unit/{unit}:
 *   get:
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: latlng
 *         schema:
 *           type: string
 *         required: true
 *         description: Latitude and longitude (format: lat,lng)
 *       - in: path
 *         name: unit
 *         schema:
 *           type: string
 *           enum: [mi, km]
 *         required: true
 *     responses:
 *       200:
 *         description: Distances to all tours
 */
router.route('/distances/:latlng/unit/:unit').get(toursController.getDistances);

module.exports = router;
