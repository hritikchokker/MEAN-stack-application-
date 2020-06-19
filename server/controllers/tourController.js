const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');
const factory = require('./handlerFactory');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1
  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat,lng ', 400));
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [lng, lat, radius] } }
  });
  res.status(200).json({
    message: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  })
})

exports.getDistances = catchAsync(async (req,res,next)=>{
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371: 0.001;
  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat,lng ', 400));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear:{
        near: {
          type: 'Point',
          coordinates: [lng*1,lat*1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },{
      $project: {
        distance:1,
        name: 1
      }
    }
  ])
  res.status(200).json({
    message: 'success',
    data: {
      data: distances
    }
  })

})



exports.getAllTours = factory.getAll(Tour);





// can even add select in options
exports.getTour = factory.getOne(Tour, { path: 'reviews' });


exports.updateTour = factory.updateOne(Tour);

exports.createTour = factory.createOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

// old one with naive approach
// exports.deleteTour = catchAsync(async (req, res,next) => {
//  const tour = await Tour.findByIdAndDelete(req.params.id)
//   if (!tour) {
//     return next(new AppError('No tour found with this id', 404))
//   }
//   res.status(204).json({
//     status: 'success'
//   })
// })

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        // _id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: {_id: {$ne: 'EASY'}}
    // }
  ])

  res.status(201).json({
    status: 'success',
    data: {
      stats
    }
  })
});


exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addField: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ])

  res.send(200).json({
    message: 'success',
    data: { plan }
  })
})










// exports.getAllTours = async (req, res) => {
//   try {
//     const queryObj = { ...req.query };
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach(el => delete queryObj[el]);

//     // const tours = await Tour.find()
//     // .where('duration')
//     // .equals(5)
//     // .where('difficulty')
//     // .equals('easy');
//     // const tours = await Tour.find({
//     //   duration: 5,
//     //   difficulty: 'easy'
//     // });
//     const tours = await Tour.find(req.query);
//     res.status(201).json({
//       status: 'success',
//       results: tours.length,
//       data: {
//         tours
//       }
//     })
//   } catch (err) {
//     res.status(404).json({
//       status: 'failed',
//       message: err
//     })
//   }
// }

// exports.createTour = async (req, res) => {
//   try {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour
//       }
//     })
//   } catch (err) {
//     res.status(401).json({
//       status: 'failed',
//       message: err
//     })
//   }
// }
