const {check} = require('express-validator');
const slugify = require('slugify');

const validatorMiddleware = require('../../middleware/validatorMiddleware');
const User = require('../../models/userSchema');

exports.signupValidator = [
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
    validatorMiddleware
];