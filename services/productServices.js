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

