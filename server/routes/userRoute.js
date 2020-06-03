const express = require('express');
const router = express.Router()
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


router.post('/signup',authController.signup);
router.post('/login', authController.login);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)
    .put(userController.updateUser)
    .delete(userController.deletAllUsers)

router.route('/:id')
    .get(userController.viewCurrentUserDetails)
    .delete(userController.deleteUser)


module.exports = router;
