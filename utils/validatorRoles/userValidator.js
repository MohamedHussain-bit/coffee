const {check} = require('express-validator');
const slugify = require('slugify');

const User = require('../../models/userSchema');
const validatorMiddleware = require('../../middleware/validatorMiddleware');


exports.careateUserValidator = [
    check('name')
        .notEmpty()
        .withMessage('user name required')
        .trim()
        .isLength({min : 3})
        .withMessage('too short user name')
        .isLength({max : 30})
        .withMessage('too long user name')
        .custom((name , {req}) => {
            req.body.slug = slugify(name);
            return true;
        }),
    check('email')
        .notEmpty()
        .withMessage('user email required')
        .trim()
        .isEmail()
        .withMessage('invalide email address')
        .custom(async(email) => {
            const user = await User.findOne({email : email});
            if(user){
                throw new Error('please enter defirant email');
            };
            return true;
        }),
    check('phone')
        .optional()
        .isMobilePhone(['ar-EG' , 'ar-BH' , 'ar-SA'])
        .withMessage('Invalide phone number only accepted Egypt , Saadia , Bahren'),
    check('password')
        .notEmpty()
        .withMessage('user password required')
        .isLength({min : 6})
        .withMessage('password must be at least 6 character'),
    check('passwordConfirm')
        .notEmpty()
        .withMessage('password confirm required')
        .custom((passwordConfirm , {req}) => {
            if(passwordConfirm !== req.body.password){
                throw new Error('Password confirm incorrect');
            };
            return true;
        }),
    check('profileImage')
        .optional(),
    check('role')
        .optional(),
    check('active')
        .optional(),
    validatorMiddleware
];

exports.getUserValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalide id'),
    validatorMiddleware
];