const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController')
const router = express.Router();


router.get('/me', authController.protectAll , viewController.getAccount);

router.get('/my-tours', authController.protectAll, viewController.getMyTours)
router.use(authController.isLoggedIn);

router.get('/',bookingController.createBookingCheckout, viewController.getOverview);

router.get('/tour/:slug', viewController.getTour);

router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);


module.exports = router;
