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
        .trim()
        .custom((name , {req}) => {
            req.body.slug = slugify(name);
            return true;
        }),
    validatorMiddleware
];