const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const Caregory = require('../models/categorySchema');

// @desc     Create category
// @route    POST api/v1/categories
// @access   Public
exports.createCategory = asyncHandler(async (req , res , next) => {
    const {name , slug} = req.body;
    const category = await Caregory.create({name , slug});
    return res.status(201).json({data : category});
});