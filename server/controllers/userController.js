const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');


exports.createUser = catchAsync(async (req, res,next) => {
  const result = await userModel.create(req.body)
  res.status(201).json({
    message: 'User created Successfully',
    data: result
  })
})

exports.updateUser = catchAsync(async (req, res,next) => {
  const result = await userModel.findOneAndUpdate(req.body);
  res.status(201).json({
    message: 'User Updated Successfully',
    data: result
  })
});

exports.viewCurrentUserDetails = catchAsync(async (req, res,next) => {
  const result = await userModel.findById(req.params.id)
  res.status(201).json({
    message: 'User details fetched Successfully',
    data: result
  })
});

exports.deleteUser = catchAsync(async (req, res,next) => {
  await userModel.deleteOne({ id: req.params.id })
  res.status(201).json({
    message: 'User deleted Successfully',
  })
});

exports.getAllUsers = catchAsync(async (req, res,next) => {
  const result = await userModel.find();
  res.status(200).json({
    message: 'User Lists fetched Successfully',
    data: result
  })
});

exports.deletAllUsers = catchAsync(async(req, res,next) => {
  await userModel.deleteMany()
  res.status(201).json({
    message: 'All Users Deleted  Successfully',
  })
});
