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

const productRoutes = require('./productRoutes');

const router = express.Router();

// Nested route 
router.use('/:categoryId/products' , productRoutes);

router.route('/')
    .post(createCategoryValidator ,createCategory)
    .get(getAllCategories)

router.route('/:id')
    .get(getSpecificCategoryValidator , getSpecificCategory)
    .put(updateCategoryValidator , updateCategory)
    .delete(deleteCategoryValidator , deleteCategory)

module.exports = router;