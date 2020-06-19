const express = require('express');
const router = express.Router()
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


router.use(authController.protect);

router.patch('/updateMyPasword',
  authController.updatePassword);

router.patch('/updateMe',
  userController.updateMe);

router.get('/me',authController.protect,
userController.getMe,
userController.getUser)

router.delete('/deleteMe',
  userController.deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .put(userController.updateUser)
  .delete(userController.deletAllUsers)

router.route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)


module.exports = router;
