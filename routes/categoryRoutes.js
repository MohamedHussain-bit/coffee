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

const {
    protected,
    allowedTo,
} = require('../services/authServices');

const productRoutes = require('./productRoutes');

const router = express.Router();

// Nested route 
router.use('/:categoryId/products' , productRoutes);

router.route('/')
    .post(
        protected, 
        allowedTo('admin'), 
        createCategoryValidator,
        createCategory
    )
    .get(getAllCategories)

router.route('/:id')
    .get(getSpecificCategoryValidator , getSpecificCategory)
    .put(
        protected, 
        allowedTo('admin'),
        updateCategoryValidator,
        updateCategory
    )
    .delete(
        protected, 
        allowedTo('admin'),
        deleteCategoryValidator,
        deleteCategory
    )

module.exports = router;