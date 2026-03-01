const asyncHandler = require('express-async-handler');
const {v4 : uuid} = require('uuid');
const sharp = require('sharp');
const multer = require('multer');

const Product = require('../models/productSchema');
const ApiErorr = require('../utils/apiError');
const { uploadMixOfImages } = require('../middleware/uploadImageMiddlewar');
const handlerFactory = require('./handlerFactory');


// Upload single image
// exports.uploadProductImage = uploadSingleImage('imageCover');
exports.uploadProductImage = uploadMixOfImages([
    {name : 'imageCover' , maxCount : 1},
    {name : 'images' , maxCount : 5}
]);

// Resize images
exports.resizeImage = asyncHandler(async (req , res , next) => {
    console.log(req.files)
    // Image proccesing for imageCover
    if(req.files.imageCove){
        const filename = `products-${uuid()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCove[0].buffer)
        .resize(600 , 600)
        .toFormat('jpeg')
        .jpeg({quality : 60})
        .toFile(`uploads/products/${filename}`);
        // To save mage on database
        req.body.imageCover = filename;
    };
    // Image proccessing for images
    if(req.files.images){
        req.body.images = [];
            // loop on images
        await Promise.all( req.files.images.map(async (image) => {
                const imageName = `products-${uuid()}-${Date.now()}.jpeg`;
                await sharp(image.buffer)
                .resize(600 , 600)
                .toFormat('jpeg')
                .jpeg({quality : 60})
                .toFile(`uploads/products/${filename}`);
                // To save mage on database
                req.body.images.push(imageName);
        }));
    };
    next();
});

// Set categoryId to body to create product debend on category
// Nested route
exports.setCategoryIdToBody = asyncHandler(async (req , res , next) => {
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
});

// Create filter object to get product on category
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
exports.createProduct = handlerFactory.createOne(Product);

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
exports.getSpecificProduct = handlerFactory.getOne(Product);

// @desc     update product
// @route    PUT api/v1/products/:id
// @access   protected
exports.updateProduct = handlerFactory.updateOne(Product);

// @desc     delete product
// @route    DELETE api/v1/products/:id
// @access   protected
exports.deleteProduct = handlerFactory.deleteOne(Product);