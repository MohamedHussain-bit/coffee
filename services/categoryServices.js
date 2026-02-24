const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const Caregory = require('../models/categorySchema');
const handlerFactory = require('./handlerFactory');

// @desc     Create category
// @route    POST api/v1/categories
// @access   Public
exports.createCategory = handlerFactory.createOne(Caregory);

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
// @route    GET api/v1/categories/:id
// @access   Public
exports.getSpecificCategory = handlerFactory.getOne(Caregory);

// @desc     Update category
// @route    PUT api/v1/categories/:id
// @access   protected
exports.updateCategory = handlerFactory.updateOne(Caregory);

// @desc     delete category
// @route    DELETE api/v1/categories/:id
// @access   protected
exports.deleteCategory = handlerFactory.deleteOne(Caregory);