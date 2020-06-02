const express = require('express');
const app = express();
const firstRoute = require('./routes/firstRoute');
const userRoute = require('./routes/userRoute');
const tourRoute = require('./routes/tourRoute');
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');


if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
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





