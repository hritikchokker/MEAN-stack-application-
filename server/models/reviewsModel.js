const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Reviews can not be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoogse.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoogse.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a User.']
    }
  }, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

reviewSchema.index({tour: 1,user:1},{unique: true})

reviewSchema.pre(/^find/, function (next) {

  this.populate({
    path: 'user',
    select: 'name photo'
  })
  next();
})
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      match: { tourId }
    }, {
      $group: {
        _id: `$tour`,
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ])
  if (stats.length > 0) {
    await Tour.findById(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    })
  }else{
    await Tour.findById(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    })
  }
}

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne()
  next();
})

reviewSchema.post(/^findOneAnd/, async function (next) {
  // this.r = await this.findOne() will not work here as the query is already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
})
const Review = mongoose.model('Reviews', reviewSchema);
module.exports = Review;
