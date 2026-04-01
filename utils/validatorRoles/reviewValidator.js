const {check} = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Review = require('../../models/reviewModel');


exports.createReviewValidator = [
    check('title')
        .optional(),
    check('ratings')
        .notEmpty()
        .withMessage('Ratings value required')
        .isFloat({min : 1 , max : 5})
        .withMessage('Ratings value must be between 1 to 5'),
    check('user')
        .notEmpty()
        .withMessage('Id with user required')
        .isMongoId()
        .withMessage('Invalide Id formate'),
    check('product')
        .notEmpty()
        .withMessage('Id with product required')
        .isMongoId()
        .withMessage('Invalide Id formate')
        .custom(async (value , {req}) => {
            // check if logged user create review before
            const review = await Review.findOne({
                user : req.user._id, 
                product : req.body.product
            });
            if(review){
                return Promise.reject(new Error('You already created a review before'));
            };
            return true;
        }),
    validatorMiddleware
];

exports.getReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalide Id format'),
    validatorMiddleware
];

exports.deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalide Id format'),
    validatorMiddleware
];

exports.updateReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalide Id formate')
        .custom(async (value , {req}) => {
            const review = await Review.findById(value);
            if(!review){
                return Promise.reject(new Error(`Ther is no review with id ${value}`));
            };
            if(review.user._id.toString() !== req.user._id.toString()){
                return Promise.reject(new Error(`You are not allowed to perform this action`));
            };
            return true;
        }),
    validatorMiddleware
];