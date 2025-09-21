const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')
const compression = require('compression')

const AppError = require('./utilities/appError');
const globalError = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes')

const app = express();


app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Helmet with custom CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "data:", "blob:"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        scriptSrc: ["'self'", "https://js.stripe.com"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        connectSrc: ["'self'", "ws:", "https://js.stripe.com"],
        frameSrc: ["'self'", "https://js.stripe.com"],
        imgSrc: ["'self'", "data:", "blob:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 50,
  message: 'Too Many Requests from this IP, Please try again in one hour',
});

app.use('/api', limiter);

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser())

// Data Sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data Sanitization against XSS
// app.use(xss())

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);


// pug config
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(compression())


// Test MiddleWare
app.use((req, res, next) => {
  req.requestTime = new Date().toString()
  // console.log(req.cookies);
  next()
  
})

// ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/bookings', bookingRouter)

app.use((req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} in this Server!`)
  // err.statusCode = 404
  // err.status = 'fail'
  next(new AppError(`Can't find ${req.originalUrl} in this Server!`, 404));
});

app.use(globalError);

module.exports = app;
