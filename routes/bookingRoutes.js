const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protectAll);

/**
 * @swagger
 * /bookings:
 *   get:
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of all bookings
 *   post:
 *     tags: [Bookings]
 *     responses:
 *       201:
 *         description: Booking created successfully
 */

router
  .route('/')
  .get( authController.restrictTo('admin', 'lead-guide'), bookingController.getAllBookings)
  .post( authController.restrictTo('admin', 'lead-guide'), bookingController.createBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *   patch:
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *   delete:
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Booking deleted successfully
 */

router
  .route('/:id')
  .get( authController.restrictTo('admin', 'lead-guide'), bookingController.getBooking)
  .patch( authController.restrictTo('admin', 'lead-guide'), bookingController.updateBooking)
  .delete( authController.restrictTo('admin', 'lead-guide'), bookingController.deleteBooking);

/**
 * @swagger
 * /bookings/checkout-session/{tourId}:
 *   get:
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         description: ID of the tour
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 */

router.get(
  '/checkout-session/:tourId',
  // bookingController.createBookingCheckout,
  bookingController.getCheckout
);
module.exports = router;
