const express = require('express');
const app = express();
const firstRoute = require('./routes/firstRoute');
const userRoute = require('./routes/userRoute');
const tourRoute = require('./routes/tourRoute');
const cors = require('cors');
const morgan = require('morgan');


if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

app.use('api/v1/users',userRoute);
app.use('api/v1/tours',tourRoute);
app.use('api/v1/home', firstRoute);

app.all('*', (req, res) => {
    res.status(404).json({
        message: 'page not found'
    })
})

module.exports = app;





