const express = require('express');
const app = express();
const firstRoute = require('./routes/firstRoute');
const userRoute = require('./routes/userRoute');
const tourRoute = require('./routes/tourRoute');
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('exprss-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');




// securing http headers
app.use(helmet());

//logging only in development
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

// creating limit for http headers
const limiter = rateLimit({
  max: 100,
  windowMs: 60*60*1000,
  message: 'Too many request from this IP,please try again after some time'
})

//limiting http request from same ip
app.use('/api',limiter);

app.use(express.static(`${__dirname}/public`));
app.use(express.json({limit: '10kb'}));

//data sanitization against nosql injection and Xss
app.use(mongoSanitize());
app.use(xss());

//prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration',
    'ratingQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));

// app.use(express.urlencoded({ extended: true}));
app.use(cors());

app.use('/api/v1/tours',tourRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/home', firstRoute);

app.all('*', (req, res) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
    // res.status(404).json({
    //   status: 'failed',
    //     message: `Can't find ${req.originalUrl} on this server`
    // })
})

app.use(globalErrorHandler);


module.exports = app;





