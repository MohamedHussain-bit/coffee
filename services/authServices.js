const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const ApiError = require('../utils/apiError');
const User = require('../models/userSchema');

// @desc     Signup
// @route    POST api/v1/auth/signup
// @access   Public
exports.signup = asyncHandler(async (req , res , next) => {
    // create user
    const user = await User.create({
        name : req.body.name,
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