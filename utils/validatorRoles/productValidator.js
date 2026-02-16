const {check} = require('express-validator');
const slugify = require('slugify');

const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Category = require('../../models/categorySchema');

exports.createProductValidator = [
    check('title')
        .notEmpty()
        .withMessage('title product required')
        .trim()
        .isLength({min : 5})
        .withMessage('too short product title')
        .isLength({max : 30})
        .withMessage('too long product title')
        .custom((value , {req}) => {
            req.body.slug = slugify(value);
        }),
    check('description')
        .notEmpty()
        .withMessage('product description required')
        .isLength({min : 20})
        .withMessage('too short product title'),
    check('quantity')
        .isNumeric()
        .withMessage('product quantity must be number')
        .notEmpty()
        .withMessage('product quantity required'),
    check('sold')
        .isNumeric()
        .withMessage('product sold must be number'),
    check('price')
        .isNumeric()
        .withMessage('product price must be number')
        .notEmpty()
        .withMessage('product price required')
        .isLength({max : 100000})
        .withMessage('to long product price'),
    check('priceAfterDiscount')
        .optional()
        .isNumeric()
        .withMessage('product price after discount must be number')
        .custom((value) => {
            if(req.body.price <= value){
                throw new Error('price after discount must be lower than price');
            };
            return true;
        }),
    check('size')
        .notEmpty()
        .withMessage('product size required')
        .isLength({max : 10})
        .withMessage('too long product size'),
    check('imageCover')
        .notEmpty()
        .withMessage('product image cover required'),
    check('images')
        .optional()
        .toArray(),
    check('category')
        .notEmpty()
        .withMessage('product must be belong on category')
        .isMongoId()
        .withMessage('invalide catecory id')
        .custom(async (categoryId) => {
            const category = await Category.findById(categoryId);
            if(!category){
                throw new Error('category for this id not found');
            };
            return true;
        }),
    check('ratingsAverage')
        .optional()
        .isNumeric()
        .withMessage('product ratings average must be number')
        .isLength({min : 1})
        .withMessage('Rating average must be above or equale 1.0')
        .isLength({max : 5})
        .withMessage('Rating average must be below or equale 5.0'),
    check('ratingsQuantity')
        .optional()
        .isNumeric()
        .withMessage('ratings quantity must be number'),
    validatorMiddleware
];