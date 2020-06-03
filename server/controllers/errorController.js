const AppError = require('../utils/appErrors');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  })
}

const handleCastErrorDB = err => {
  const message = 'Invalid ${err.path}: ${err.value}';
  return new AppError(message, 400);

}

const handleDuplicateFieldsDb = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
  const error = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${error.join('. ')}`
  return new AppError(message, 400);
}

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    console.err('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })
  }
}

module.exports = ((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDb(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    sendErrorProd(err, res);
  }
});
