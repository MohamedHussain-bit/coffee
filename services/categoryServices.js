const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const Caregory = require('../models/categorySchema');

// @desc     Create category
// @route    POST api/v1/categories
// @access   Public
exports.createCategory = asyncHandler(async (req , res , next) => {
    const {name} = req.body;
    const category = await Caregory.create({name});
    return res.status(201).json({data : category});
});