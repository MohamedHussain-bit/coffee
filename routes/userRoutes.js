const express = require('express');

const {
    createUser,
    getAllUser,
    getUser,
    updateUser,
    deleteUser,
    changePassword,
} = require('../services/userServices');

const router = express.Router();

// Change user password
router.route('changePasswored/:id')
    .put(changePassword)
    
router.route('/')
    .post(createUser)
    .get(getAllUser)

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router;