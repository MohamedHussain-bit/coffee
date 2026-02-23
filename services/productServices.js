const asyncHandler = require('express-async-handler');
const multer = require('multer');
const {v4 : uuid} = require('uuid');
const sharp = require('sharp');

const Product = require('../models/productSchema');
const ApiErorr = require('../utils/apiError');
const { uploadSingleImage } = require('../middleware/uploadImageMiddlewar');

// Upload single image
exports.uploadProductImage = uploadSingleImage('imageCover');

// Resize images
exports.resizeImage = asyncHandler(async (req , res , next) => {
    const filename = `products-${uuid()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
    .resize(600 , 600)
    .toFormat('jpeg')
    .jpeg({quality : 60})
    .toFile(`uploads/products/${filename}`);
    // To save mage on database
    req.body.imageCover = filename;
    next();
});

// Set categoryId to body to create product debend on category
// Nested route
exports.setCategoryIdToBody = asyncHandler(async (req , res , next) => {
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
});

// Creat filter object to get product on category
exports.createFilterObject = asyncHandler(async (req , res , next) => {
    let filterObject = {};
    if(req.params.categoryId)
        filterObject = {category : req.params.categoryId};

    req.filterObject = filterObject;
    next()
});

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

    const products = await Product.find(req.filterObject).skip(skip).limit(limit);

    if(!products){
        return next(new ApiErorr('Products not found' , 404));
    };

    return res.status(200).json({
        results : products.length,
        page : page,
        data : products,
    });
});

// @desc     Get specific product
// @route    GET api/v1/products/:id
// @access   public
exports.getSpecificProduct = asyncHandler(async (req , res , next) => {
    const {id} = req.params;

    const product = await Product.findById(id);

    if(!product){
        return next(new ApiErorr(`product for this id ${id} not found` , 404));
    };

    return res.status(200).json({data : product});
});

// @desc     update product
// @route    PUT api/v1/products/:id
// @access   protected
exports.updateProduct = asyncHandler(async (req , res , next) => {
    const {id} = req.params;

    const product = await Product.findByIdAndUpdate({_id : id} , req.body , {new : true});

    if(!product){
        return next(new ApiErorr(`product for this id ${id} not found` , 404));
    };

    return res.status(200).json({data : product});
});

// @desc     delete product
// @route    DELETE api/v1/products/:id
// @access   protected
exports.deleteProduct = asyncHandler(async (req , res , next) => {
    const {id} = req.params;

    const product = await Product.findByIdAndDelete(id);

    if(!product){
        return next(new ApiErorr(`product for this id ${id} not found` , 404));
    };

    return res.status(204).send();
});