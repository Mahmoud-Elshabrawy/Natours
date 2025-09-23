
const Tour = require('../models/tourModel')
const Booking = require('../models/bookingModel')
const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/appError')


exports.getOverview = catchAsync(async(req, res, next) => {
    const tours = await Tour.find()
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
})

exports.alerts = (req, res, next) => {
    const {alert} = req.query

    if(alert === 'booking') {
        res.local.alert = 'Your booking was successful! \n if your booking doesn\'t shows up here immediately, please come back later'
    }
    next()
}

exports.getTour = catchAsync(async(req, res, next) => {
    const slug = req.params.slug
    const tour = await Tour.findOne({slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    })
    
    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    })
})


exports.getLoginForm = (req, res) => {

    res.status(200).render('login', {
        title: 'Log into your account'
    })
}

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Create Your Account'
    })
}

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    })
}

exports.getMyTours = catchAsync(async(req, res, next) => {

    // Get the bookings of the currently user
    const bookings = await Booking.find({user: req.user.id})

    // Find tours with returned IDs
    const toursIDs = bookings.map(el => el.tour)
    const tours = await Tour.find({_id: {$in: toursIDs}})

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
    })
})
