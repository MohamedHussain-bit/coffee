const express = require('express');

const {
    createCategory,
    getAllCategories,
    getSpecificCategory,
    updateCategory,
    deleteCategory,
} = require('../services/categoryServices');

const {
    createCategoryValidator,
    getSpecificCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
} = require('../utils/validatorRoles/categoryValidator');

const router = express.Router();

router.route('/')
    .post(createCategoryValidator ,createCategory)
    .get(getAllCategories)

router.route('/:id')
    .get(getSpecificCategoryValidator , getSpecificCategory)
    .put(updateCategoryValidator , updateCategory)
    .delete(deleteCategoryValidator , deleteCategory)

module.exports = router;