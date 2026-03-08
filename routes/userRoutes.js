const express = require('express');

const {
    createUser,
    getAllUser,
    getUser,
    updateUser,
    deleteUser,
    changePassword,
} = require('../services/userServices');

const {
    careateUserValidator,
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    chengeUserPasswordValidator,
} = require('../utils/validatorRoles/userValidator');

const router = express.Router();

// Change user password
router.route('/changePasswored/:id')
    .put(chengeUserPasswordValidator , changePassword)

router.route('/')
    .post(careateUserValidator , createUser)
    .get(getAllUser)

router.route('/:id')
    .get(getUserValidator , getUser)
    .put(updateUserValidator , updateUser)
    .delete(deleteUserValidator , deleteUser)

module.exports = router;