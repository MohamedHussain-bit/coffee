const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const ApiError = require('../utils/apiError');
const User = require('../models/userSchema');
const createToken = require('../utils/createToken');
const sendEmail = require('../utils/sendEmail');

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
    const token = createToken(user._id);
    return res.status(201).json({data : user , token});
});

// @desc     Login
// @route    POST api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req , res , next) => {
    // check if user exist and check if password correct
    const user = await User.findOne({email : req.body.email});
    if(!user || ! await bcrypt.compare(req.body.password , user.password)){
        return next(new ApiError('Incorect email or password' , 401));
    };
    // Generate token
    const token = createToken(user._id);
    // Set token in cookies
    res.cookie("token" , token , {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
        maxAge : 1000 * 60 * 60 * 24 * 90
    });
    return res.status(200).json({data : user , token});
});

// @desc     logout
// @route    POST api/v1/auth/logout
// @access   Public
exports.logout = asyncHandler(async (req , res , next) => {
    // Delete cookie
    res.cookie("token" , "" , {
        httpOnly : true,
        secure : true,
        sameSite : "lax",
        expires : new Date(0),
    });
    res.status(200).json({message : 'logged out successfully'});
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

// @desc     Forget password
// @route    POST api/v1/auth/forgetPassword
// @access   Public
exports.forgetPassword = asyncHandler(async (req , res , next) => {
    // Get user by email
    const user = await User.findOne({email : req.body.email});
    if(!user){
        return next(new ApiError('not found user for this email' , 404));
    };
    // Generate reset random 6 digit and save it in db
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp , 10);
    // Save hashed otp on db
    user.passwordResetOtp = hashedOtp;
    // add expires time for password reset otp
    user.resetOtpExpires = Date.now() + 1000 * 60 * 10;
    user.passwordResetOtpVerified = false;
    await user.save();
    // Careate message
    const message = `Dear ${user.name},\nYour code is: ${otp}. Use to access your account.\nIf you did not request this, simply ignore this message\nYours,\nThe coffee-App Team`;
    // Send the email
    try{
    await sendEmail({
        email : user.email,
        subject : 'your password reset code (valide for 10 min)',
        message
    });
    }catch(err){
        user.passwordResetOtp = undefined;
        user.resetOtpExpires = undefined;
        await user.save();
        return next(new ApiError('failed to send email' , 500));
    }

    res.status(200).json({status : 'Success' , message : 'code sent to email'});
});

// @desc     Verify reset password otp
// @route    POST api/v1/auth/verifyResetPasswordOtp
// @access   Public
exports.verifyResetPasswordOtp = asyncHandler(async (req , res , next) => {
    const hashedOtp = await bcrypt.hash(req.body.otp , 10);
    // Get user based on reset password otp
    const user = await User.findOne({
        passwordResetOtp : hashedOtp,
        resetOtpExpires : {$gt : Date.now()},
    });
    if(!user){
        return next(new ApiError('invalid or expired otp' , 400));
    }
    user.passwordResetOtpVerified = true;
    user.passwordResetOtp = undefined;
    await user.save();
    res.status(200).json({status : 'Success' , message : 'otp verified successfully'});
});

// @desc     Reset password
// @route    POST api/v1/auth/resetPassword
// @access   Public
exports.resetPassword = asyncHandler(async (req , res , next) => {
    // Get user based on email
    const user = await User.findOne({email : req.body.email});
    if(!user){
        return next(new ApiError('not found user for this email' , 404));
    }
    if(!user.passwordResetOtpVerified){
        return next(new ApiError('you are not allowed to reset password for this user' , 403));
    }
    user.password = req.body.newPassword;
    user.passwordResetOtp = undefined;
    user.resetOtpExpires = undefined;
    user.passwordResetOtpVerified = undefined;
    await user.save();
    res.status(200).json({status : 'Success' , message : 'password reset successfully'});
});