require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const connectDB = require('./config/connectDB');
const ApiError = require('./utils/apiError');
const glbalError = require('./middleware/globalError');

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
    console.log(`mode ${process.env.NODE_ENV}`);
};

// If not found routes
app.use((req , res , next) => {
    next(new ApiError(`can not found this route ${req.originalUrl}` , 404));
});

// Global error handeling middleware
app.use(glbalError);

mongoose.connection.once('open' , () => {
    console.log('connect with database successfully');
});

app.listen(PORT , () => {
    console.log(`Server is runing on port ${PORT}`)
});

mongoose.connection.on('error' , (err) => {
    console.log(err);
});