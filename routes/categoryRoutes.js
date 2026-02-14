const express = require('express');

const {
    createCategory,
} = require('../services/categoryServices');

const {
    createCategoryValidator,
} = require('../utils/validatorRoles/categoryValidator');

const router = express.Router();

router.route('/')
    .post(createCategoryValidator ,createCategory)


module.exports = router;