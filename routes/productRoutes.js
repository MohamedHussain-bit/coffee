const express = require('express');

const {
    createProduct,
    getAllProducts,
    getSpecificProduct,
    updateProduct,
    deleteProduct,
    createFilterObject,
    setCategoryIdToBody,
} = require('../services/productServices');

const {
    createProductValidator,
    getSpecificProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require('../utils/validatorRoles/productValidator');

const router = express.Router({mergeParams : true});

router.route('/')
    .post(setCategoryIdToBody , createProductValidator , createProduct)
    .get(createFilterObject , getAllProducts)

router.route('/:id')
    .get(getSpecificProductValidator , getSpecificProduct)
    .put(updateProductValidator , updateProduct)
    .delete(deleteProductValidator , deleteProduct)

module.exports = router;