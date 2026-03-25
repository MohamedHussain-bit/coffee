const asyncHandler = require('express-async-handler');
const {v4 : uuid} = require('uuid');
const sharp = require('sharp');
const bcrypt = require('bcrypt');

const ApiError = require('../utils/apiError');
const User = require('../models/userSchema');
const handlerFactory = require('./handlerFactory');
const {uploadSingleImage} = require('../middleware/uploadImageMiddlewar');
const createToken = require('../utils/createToken');


// Upload profileImage
exports.uploadUserImage = uploadSingleImage('profileImage')


// @desc     Create user
// @route    POST /api/v1/users
// @access   Private
exports.createUser = handlerFactory.createOne(User);

// @desc     Get all user
// @route    GET /api/v1/users
// @access   Private
exports.getAllUser = asyncHandler(async (req , res , next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit; 

    const users = await User.find({}).skip(skip).limit(limit);
    if(!users){
        next(new ApiError(`not found users` , 404));
    };
    res.status(200).json({data : users});
});

// @desc     Get specific user
// @route    GET /api/v1/users/:id
// @access   Private
exports.getUser = handlerFactory.getOne(User);

// @desc     Delete user
// @route    DELETE /api/v1/users/:id
// @access   Private
exports.deleteUser = handlerFactory.deleteOne(User);

// @desc     Update user
// @route    PUT /api/v1/users/:id
// @access   Private
exports.updateUser = asyncHandler(async (req , res , next) => {
    const {id} = req.params;
    const {name, slug, email, phone, profileImage, role, active} = req.body;
    const user = await User.findByIdAndUpdate(
        id,
        {
            name,
            slug,
            email,
            phone,
            profileImage,
            role,
            active,
        },
        {
            new : true
        }
    );
    if(!user){
        next(new ApiError(`user for this id ${id} not found` , 404));
    };
    return res.status(200).json({data : user});
});

// @desc     Change user password
// @route    PUT /api/v1/users/changePassword/:id
// @access   Private
exports.changePassword = asyncHandler(async (req , res , next) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            password : await bcrypt.hash(req.body.newPassword , 10),
            passwordChangedAt : Date.now()
        },
        {
            new : true
        }
    );
    if(!user){
        next(new ApiError(`not found password for this user` , 404));
    };
    return res.status(200).json({data : user});
});

// @desc     Get logged user data
// @route    GET /api/v1/users/getMe
// @access   Private/protected
exports.getLoggedUserData = asyncHandler(async (req , res , next) => {
    req.params.id = req.user._id;
    next();
});

// @desc    Update logged user password
// @route   PUT /api/users/updateMyPassword
// @access  private/protected
exports.updateLoggedUserPassword = asyncHandler(async (req , res , next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            password : await bcrypt.hash(req.body.newPassword , 10),
            passwordChangedAt : Date.now()
        },
        {new : true}
    );
    const token = createToken(user._id);
    // Set token in cookies
    res.cookie("token" , token , {
        httpOnly : true,
        sameSite : "strict",
        secure : true,
        maxAge : 1000 * 60 * 60 * 24 * 90
    });
    res.status(200).json({data : user , token});
});

// @desc    Update logged user data
// @route   PUT /api/users/updateMe
// @access  private/protected
exports.updateLoggeUserData = asyncHandler(async (req , res , next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone
        },
        {new : true}
    );
    if(!user){
        return next(new ApiError(`User for this id not found` , 404));
    };
    return res.status(200).json({data : user});
});

// @desc    Delete logged user
// @route   DELETE /api/users/deleteMe
// @access  private/protected
exports.deleteLoggedUserData = asyncHandler(async (req , res , next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {active : false}
    );
    return res.status(204).send();
});