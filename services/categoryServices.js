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

// @desc     Get all category
// @route    GET api/v1/categories
// @access   Public
exports.getAllCategories = asyncHandler(async (req , res , next) => {
    // Pagenation
    const page = Number(req.query.page) || 1;
    const limit = Number(req.params.limit) || 5;
    const skip = (page - 1) * limit;

    const categories = await Caregory.find({}).skip(skip).limit(limit);

    if(!categories){
        return next(new ApiError('not found categories' , 404));
    };

    return res.status(200).json({
        results : categories.length,
        page : page,
        data :categories,
    });
});

// @desc     Get specific category
// @route    GET api/v1/categories
// @access   Public
exports.getSpecificCategory = asyncHandler(async (req , res , next) => {
    const {id} = req.params;
    const category = await Caregory.findById(id);
    if(!category){
        return next(new ApiError(`category for this id ${id} not found` , 404));
    };
    return res.status(200).json({
        data : category
    });
});