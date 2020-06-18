const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');
const reviewRouter = require('../routes/reviewRoute');
// const reviewController = require('../controllers/reviewController');

// router.route('/top-5-cheap')
//   .get(tourController.aliasTopTours, tourController.getAllTours)


router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats')
  .get(tourController.getTourStats);

router.route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan,
    authController.protect,
    authController.restrictTo('admin', 'lead-guide','guides'),)

router.route('/')
  .get(tourController.getAllTours)
  .post(authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.createTour)

router.route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour)
  .delete(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour)



// router.route('/:tourId/reviews')
//   .post(authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview)

module.exports = router;
