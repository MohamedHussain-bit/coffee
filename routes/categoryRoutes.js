const express = require('express');

const {
    createCategory,
    getAllCategories,
} = require('../services/categoryServices');

const {
    createCategoryValidator,
} = require('../utils/validatorRoles/categoryValidator');

const router = express.Router();

router.route('/')
    .post(createCategoryValidator ,createCategory)
    .get(getAllCategories)


module.exports = router;