const {check} = require('express-validator');
const slugify = require('slugify');

const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.createCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('category name required')
        .isLength({min : 5})
        .withMessage('too short category name')
        .isLength({max : 20})
        .withMessage('too long category name')
        .custom((value , {req}) => {
            req.body.slug = slugify(value , {lower : true});
            console.log(req.body)
            return true;
        }),
    validatorMiddleware
];

exports.getSpecificCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalide Id'),
    validatorMiddleware
];