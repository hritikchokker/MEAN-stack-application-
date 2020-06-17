const catchAsync = require('../utils/catchAsync');
const AppError = requir('../utils/appErrors.js');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)
  if (!tour) {
    return next(new AppError('No Document found with this id', 404))
  }
  res.status(204).json({
    status: 'success'
  })
})
