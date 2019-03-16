const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const products = require('./routes/products');
const orders = require('./routes/orders');
const user = require('./routes/user');

// setup express
app.listen(process.env.PORT || 9000);
console.log("Server Is Live");

//setup database
mongoose.connect('mongodb://vv:123asd@ds357955.mlab.com:57955/vv', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

//setup morgan
app.use(morgan('dev'));

//setup bodyparser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// disable cross orgigin resource sharing
app.use((res, req, next) => {
    res.header('Access-Control-Allow-Arigin', '*');
    res.header('Access-Control-Allow-Header', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    };
    next();
});

//routes
app.use('/products', products);
app.use('/orders', orders);
app.use('/users', user);

// to make upload folder access
app.use('/uploads', express.static('uploads'));

//middleware for error handling
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});
