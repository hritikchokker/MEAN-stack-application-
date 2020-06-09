const User = require('../models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser,201,res);
  // const token = signToken(newUser._id);
  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser
  //   }
  // })
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !await user.correctPassword(password, user.password)) {
    return next(new AppError('Incorrect email or password', 401))
  }
  createSendToken(user, 200, res);
})


exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in Please login', 401))
  }

  const decoded = await promisify(jwt.verify(token, process.env.JWT_SECRET));

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to token does not exists', 401)
    );
  }

  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User Recently changed password. Please login again', 401));
  }
  req.user = freshUser;
  next();
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }
    next();
  }
};

exports.forgotPassword = catchAsync(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address', 404))
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const host = req.get('host');
  const resetURL = `${req.protocol}://${host}/api/v1/user/resetPassword/${resetToken}`;

  const message = `Forgot password ? Submit a new request to${resetURL}`;

  try {

    await sendEmail({
      email: user.email,
      subject: 'You passowrd reset token valid for 10 mins',
      message
    })
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    })

  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending email. Please try again later', 500)
    )
  }
});

const createSendToken = (user,statusCode,res)=>{
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}

exports.resetPassword = catchAsync(async (req, res, next) => {

  const hashedToken = crypto.createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(
      new AppError('Token is invalid or has expired', 400)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(newUser, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {

  const user = await User
    .findById(req.user.id)
    .isSelected('+password');

  if (await !user.correctPassword(req.body.passwordCurrent, user.password)) {
    return next(new AppError('Current password is wrong', 401))
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);

})

