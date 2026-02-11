require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const connectDB = require('./config/connectDB');

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
    console.log(`mode ${process.env.NODE_ENV}`);
};

// Global error handeling middleware
app.use((err , req , res , next) => {
    res.status(500).json({err});
});

mongoose.connection.once('open' , () => {
    console.log('connect with database successfully');
});

app.listen(PORT , () => {
    console.log(`Server is runing on port ${PORT}`)
});

mongoose.connection.on('error' , (err) => {
    console.log(err);
});