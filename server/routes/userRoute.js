const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router()

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)
    .put(userController.updateUser)
    .delete(userController.deletAllUsers)

router.route('/:id')
    .get(userController.viewCurrentUserDetails)
    .delete(userController.deleteUser)


module.exports = router;