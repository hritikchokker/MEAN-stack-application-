const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

reviewSchema.pre(/^find/,function(next){

  this.populate({
    path: 'user',
    select: 'name photo'
  })
  next();
})
reviewSchema.statics.calcAverageRatings = async function(tourId){
 const stats = await this.aggregate([
    {
      match: {tourId}
    },{
      $group:{
        _id:`$tour`,
        nRating: {$sum: 1},
        avgRating: {$avg: '$rating'}
      }
    }
  ])
  await Tour.findById(tourId,{
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating
  })
}

reviewSchema.post('save',function(){
  this.constructor.calcAverageRatings(this.tour);
})
const Review = mongoose.model('Reviews',reviewSchema);
module.exports = Review;
