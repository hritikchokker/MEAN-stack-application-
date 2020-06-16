const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review:{
      type: String,
      required: [true,'Reviews can not be empty']
    },
    rating:{
      type: Number,
      min:1,
      max:5
    },
    createdAt:{
      type: Date,
      default: Date.now()
    },
    tour:{
      type: mongoogse.Schema.ObjectId,
      ref: 'Tour',
      required: [true,'Review must belong to a tour.']
    },
    user: {
      type: mongoogse.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a User.']
    }
  },{
    toJSON:{virtuals: true},
    toObject: {virtuals: true}
  }
);

const Review = mongoose.model('Reviews',reviewSchema);
module.exports = Reviews;
