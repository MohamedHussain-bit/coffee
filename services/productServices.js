const asyncHandler = require('express-async-handler');

const Product = require('../models/productSchema');
const ApiErorr = require('../utils/apiError');

// @desc     Careate product
// @route    POST api/v1/products
// @access   protected
exports.createProduct = asyncHandler(async (req , res , next) => {
    const product = await Product.create(req.body);
    return res.status(201).json({
        data : product
    });
});

// @desc     Get products
// @route    GET api/v1/products
// @access   public
exports.getAllProducts = asyncHandler(async (req , res , next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const products = await Product.find({}).skip(skip).limit(limit);

    if(!products){
        return next(new ApiErorr('Products not found' , 404));
    };

    return res.status(200).json({
        results : products.length,
        page : page,
        data : products,
    });
});