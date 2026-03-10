const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

require('dotenv').config();
const connectDB = require('./config/connectDB');
const ApiError = require('./utils/apiError');
const glbalError = require('./middleware/globalError');
const mountRoutes = require('./routes/mountRoutes');


const PORT = process.env.PORT || 3000;

// Connect with database
connectDB();

const app = express();

app.use(express.json());

// serve static file into uploads folder
app.use(express.static(path.join(__dirname , 'uploads')));

// Middleware to logger
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
    console.log(`mode ${process.env.NODE_ENV}`);
};

// mount routes
mountRoutes(app);

// If not found routes
app.use((req , res , next) => {
    next(new ApiError(`can not found this route ${req.originalUrl}` , 404));
});

// Global error handeling middleware
app.use(glbalError);

// check connect with database successfully
mongoose.connection.once('open' , () => {
    console.log('connect with database successfully');
});

const server = app.listen(PORT , () => {
    console.log(`Server is runing on port ${PORT}`)
});

mongoose.connection.on('error' , (err) => {
    console.log(err);
});

// Handled rejection error outside express
process.on('unhandledRejection' , (err) => {
    console.log(`unhandledRejection ${err.name} | ${err.message}`);
    server.close(() => {
        console.log('Shutting down.....');
        process.exit(1);
    });
});