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

const {
    protected,
    allowedTo,
} = require('../services/authServices');

const router = express.Router({mergeParams : true});

router.route('/')
    .post(
        protected, 
        allowedTo('admin'),
        uploadProductImage, 
        resizeImage,  
        setCategoryIdToBody, 
        createProductValidator, 
        createProduct
    )
    .get(createFilterObject , getAllProducts)

router.route('/:id')
    .get(getSpecificProductValidator , getSpecificProduct)
    .put(
        protected, 
        allowedTo('admin'),
        uploadProductImage, 
        resizeImage, 
        updateProductValidator, 
        updateProduct
    )
    .delete(
        protected, 
        allowedTo('admin'),
        deleteProductValidator, 
        deleteProduct
    )

module.exports = router;