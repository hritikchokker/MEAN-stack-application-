const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please tell us your name!']
    },
    email: {
        type: String,
        unique: true,
        required: [true,'Please provide your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'Please provide a valid email']
    },
    photo: String,
    role:{
      type: String,
      enum: ['user','guide','lead-guide','admin'],
      default: 'user'
    },
    password:{
      type: String,
      required: [true,'Please provide a password'],
      minlength: 8,
      select: false
    },
    passwordConfirm:{
      type: String,
      required: [true,'Please confirm your password'],
      validate:{
        // this only works on save but not in update scenario
        validator: function(el){
          return el === this.password
        },
        message: 'Passwords does not match'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpired: Date
})

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password,12);
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
  return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.method.changePasswordAfter = function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() /1000,10);

    return JWTTimestamp < changedTimeStamp;
  }
  return false;
}

userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');

 this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
 this.passwordResetExpired = Date.now() + 10*60*1000;
 return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
