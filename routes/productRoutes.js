const express = require('express');

const {
    createProduct,
    getAllProducts,
    getSpecificProduct,
    updateProduct,
    deleteProduct,
} = require('../services/productServices');

const {
    createProductValidator,
    getSpecificProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require('../utils/validatorRoles/productValidator');

const router = express.Router();

router.route('/')
    .post(createProductValidator , createProduct)
    .get(getAllProducts)

router.route('/:id')
    .get(getSpecificProductValidator , getSpecificProduct)
    .put(updateProductValidator , updateProduct)
    .delete(deleteProductValidator , deleteProduct)

module.exports = router;