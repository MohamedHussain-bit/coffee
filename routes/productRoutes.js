const express = require('express');

const {
    createProduct,
    getAllProducts,
    getSpecificProduct,
    updateProduct,
    deleteProduct,
    createFilterObject,
    setCategoryIdToBody,
    uploadProductImage,
    resizeImage,
} = require('../services/productServices');

const {
    createProductValidator,
    getSpecificProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require('../utils/validatorRoles/productValidator');

const router = express.Router({mergeParams : true});

router.route('/')
    .post(uploadProductImage , resizeImage ,  setCategoryIdToBody , createProductValidator , createProduct)
    .get(createFilterObject , getAllProducts)

router.route('/:id')
    .get(getSpecificProductValidator , getSpecificProduct)
    .put(uploadProductImage , resizeImage , updateProductValidator , updateProduct)
    .delete(deleteProductValidator , deleteProduct)

module.exports = router;