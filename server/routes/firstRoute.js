const express = require('express');
const testData = require('../controllers/firstController');
const router = express.Router();


router.route('/')
.get(testData.getAllData)

router.route('/details')
.get(testData.getDetails)



module.exports=router;