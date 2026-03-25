const express = require('express');

const {
    createUser,
    getAllUser,
    getUser,
    updateUser,
    deleteUser,
    changePassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggeUserData,
    deleteLoggedUserData,
} = require('../services/userServices');

const {
    careateUserValidator,
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
    chengeUserPasswordValidator,
} = require('../utils/validatorRoles/userValidator');

const {
    protected,
    allowedTo,
} = require('../services/authServices');

const router = express.Router();

// Change user password
router.route('/changePasswored/:id')
    .put(chengeUserPasswordValidator , changePassword)

router.route('/')
    .post(
        protected,
        allowedTo('admin'),
        careateUserValidator, 
        createUser
    )
    .get(
        protected, 
        getAllUser
    )

router.route('/:id')
    .get(
        protected, 
        getUserValidator,
        getUser
    )
    .put(
        protected,
        allowedTo('admin'),
        updateUserValidator, 
        updateUser
    )
    .delete(
        protected,
        allowedTo('admin'),
        deleteUserValidator, 
        deleteUser
    )

router.route('/getMe')
    .get(
        protected,
        allowedTo('user'),
        getLoggedUserData,
        getUser
    )

router.route('/changeMyPassword')
    .put(
        protected,
        allowedTo('user'),
        updateLoggedUserPassword
    )

router.route('/updateMe')
    .put(
        protected,
        allowedTo('user'),
        updateLoggeUserData
    )

router.route('/deleteMe')
    .delete(
        protected,
        allowedTo('user'),
        deleteLoggedUserData
    )

module.exports = router;