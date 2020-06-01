const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required:[true,'A tour must have a name']
  },
  duration: {
    type: Number,
    required: [true,'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: Number,
    required: [true, 'A tour must have a difficulty']
  },
  ratingAverage:{
    type: Number,
    default: 4.5
  },
  ratingQuantity:Number,
  priceDiscount: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true,'A tour must have a price']
  },
  summary:{
    type: String,
    trim: [,'A Tour must have a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true,'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
})

const Tour = mongoose.model('Tour',tourSchema);

module.exports = Tour;
