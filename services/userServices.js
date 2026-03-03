const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const User = require('../models/userSchema');
const handlerFactory = require('./handlerFactory');


// @desc     Create user
// @route    POST /api/v1/users
// @access   Private
exports.createUser = handlerFactory.createOne(User);

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
    const id = req.params;
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