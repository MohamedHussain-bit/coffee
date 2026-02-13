const express = require('express');

const {
    createCategory,
} = require('../services/categoryServices');

const router = express.Router();

router.route('/')
    .post(createCategory)


module.exports = router;