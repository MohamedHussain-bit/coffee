const express = require('express');

const {
    createCategory,
    getAllCategories,
    getSpecificCategory,
} = require('../services/categoryServices');

const {
    createCategoryValidator,
    getSpecificCategoryValidator,
} = require('../utils/validatorRoles/categoryValidator');

const router = express.Router();

router.route('/')
    .post(createCategoryValidator ,createCategory)
    .get(getAllCategories)

router.route('/:id')
    .get(getSpecificCategoryValidator , getSpecificCategory)

module.exports = router;