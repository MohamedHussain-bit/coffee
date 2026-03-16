const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const ApiError = require('../utils/apiError');
const User = require('../models/userSchema');

// @desc     Signup
// @route    POST api/v1/auth/signup
// @access   Public
exports.signup = asyncHandler(async (req , res , next) => {
    // create user
    const user = await User.create({
        name : req.body.name,
        slug : req.body.slug,
        email : req.body.email,
        password : req.body.password,
    });
    // Generate token
    const token = jwt.sign(
        {userId : user._id},
        process.env.JWT_SECRET_KEY,
        {expiresIn : process.env.JWT_SECRET_TIME}
    );
    return res.status(201).json({data : user , token});
});

// @desc     Login
// @route    POST api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req , res , next) => {
    // check if user exist and check if password correct
    const user = await User.findOne({email : req.body.email});
    if(!user || !bcrypt.compare(req.body.password , user.password)){
        return next(new ApiError('Incorect email or password' , 401));
    };
    // Generate token
    const token = jwt.sign(
        {userId : user._id},
        process.env.JWT_SECRET_KEY,
        {expiresIn : process.env.JWT_SECRET_TIME}
    );
    // Set token in cookies
    res.cookie("token" , token , {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
        maxAge : 1000 * 60 * 60 * 24 * 90
    });
    return res.status(200).json({data : user , token});
});

// Check if user exist on system
exports.protected = asyncHandler(async (req , res , next) => {
    // check if token exist
    let token;
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    };
    if(!token){
        return next(new ApiError(`you are not login, please login to get this route`, 401));
    };
    // Verify token (no chenge hapens , expired token)
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
    // check if user exist
    const currentUser = await User.findById(decoded.userId);
    if(!currentUser){
        return next(new ApiError('the user that belong to this token dose no longer exist'));
    };
    // check if user change password after created
    if(currentUser.passwordChangedAt){
        const passwordChangedTimeStamb = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000 , 10
        );
        if(passwordChangedTimeStamb > decoded.iat){
            return next(new ApiError('user recently changed his password. please login agin' , 401));
        };
    };
    req.user = currentUser;
    next();
});

// User permission
exports.allowedTo = (...roles) => {
    return asyncHandler(async (req , res , next) => {
        if(!roles.includes(req.user.role)){
            return next(new ApiError(`you are not allwoed to access this route` , 403));
        };
        next();
    });
};