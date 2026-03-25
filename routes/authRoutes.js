const express = require('express');

const {
    signup,
    login,
    logout,
    forgetPassword,
} = require('../services/authServices');

const {
    signupValidator,
    loginValidator,
} = require('../utils/validatorRoles/authValidator');

const router = express.Router();

router.route('/signup')
    .post(signupValidator , signup)

router.route('/login')
    .post(loginValidator , login)

router.route('/logout')
    .post(logout)

router.route('/forgotPassword')
    .post(forgetPassword)

module.exports = router;