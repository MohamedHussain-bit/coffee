const express = require('express');

const {
    signup,
} = require('../services/authServices');

const {
    signupValidator
} = require('../utils/validatorRoles/authValidator');

const router = express.Router();

router.route('/signup')
    .post(signupValidator , signup)

module.exports = router;