const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};



exports.getAllTours = catchAsync(async (req, res,next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  res.status(201).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
});


exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  })
});



exports.getTour = catchAsync(async (req, res,next) => {
  const tour = await (await Tour.findById(req.params.id));

  if(!tour) {
   return next(new AppError('No tour found with this id',404))
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour
    }
  })
})

exports.updateTour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) {
    return next(new AppError('No tour found with this id', 404))
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour
    }
  })
});


exports.deleteTour = catchAsync(async (req, res,next) => {
 const tour = await Tour.findByIdAndDelete(req.params.id)
  if (!tour) {
    return next(new AppError('No tour found with this id', 404))
  }
  res.status(204).json({
    status: 'success'
  })
})

exports.getTourStats = catchAsync(async (req, res,next) => {
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


exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
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
