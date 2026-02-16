const express = require('express');

const {
    createProduct,
    getAllProducts,
    getSpecificProduct,
    updateProduct,
    deleteProduct,
} = require('../services/productServices');

const router = express.Router();

router.route('/')
    .post(createProduct)
    .get(getAllProducts)

router.route('/:id')
    .get(getSpecificProduct)
    .put(updateProduct)
    .delete(deleteProduct)

module.exports = router;