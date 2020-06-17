const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');
const factory = require('./handlerFactory');

exports.createUser = catchAsync(async (req, res, next) => {
  const result = await User.create(req.body)
  res.status(201).json({
    message: 'User created Successfully',
    data: result
  })
})

exports.updateUser = catchAsync(async (req, res, next) => {
  const result = await User.findOneAndUpdate(req.body);
  res.status(201).json({
    message: 'User Updated Successfully',
    data: result
  })
});

exports.viewCurrentUserDetails = catchAsync(async (req, res, next) => {
  const result = await User.findById(req.params.id)
  res.status(201).json({
    message: 'User details fetched Successfully',
    data: result
  })
});

// exports.deleteUser = catchAsync(async (req, res, next) => {
//   await User.deleteOne({ id: req.params.id })
//   res.status(201).json({
//     message: 'User deleted Successfully',
//   })
// });
exports.deleteUser = factory.deleteOne(User);


exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    message: 'User Lists fetched Successfully',
    results: users.length,
    data: users
  })
});

exports.deletAllUsers = catchAsync(async (req, res, next) => {
  await User.deleteMany()
  res.status(201).json({
    message: 'All Users Deleted  Successfully',
  })
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })

  return newObj;
}

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('this route is not for password update', 400));
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = User.findByIdAndUpdate(req.iser.id, filteredBody, {
    new: true,
    runValidator: true
  });
  res.send(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  })
});
