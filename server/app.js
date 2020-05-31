const express = require('express');
const app = express();
const firstRoute = require('./routes/firstRoute');
const userRoute = require('./routes/userRoute');
const cors = require('cors');


app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

app.use('/home', firstRoute);
app.use('/user',userRoute);

app.all('*', (req, res) => {
    res.status(404).json({
        message: 'page not found',
        err: {
            errorMessage: 'the page you are trying to acces does not exists'
        }
    })
})

module.exports = app;





