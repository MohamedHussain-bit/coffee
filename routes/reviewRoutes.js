const express = require('express');

const router = express.Router();

const {
  createReview,
  getAllReviews,
  getReview,
  deleteReview,
  updateReview
} = require('../services/reviewServices');

const {
  createReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
  updateReviewValidator,
} = require('../utils/validatorRoles/reviewValidator');

const {
    protected ,
    allowedTo,
} = require('../services/authServices');

router.use(
  protected, 
  allowedTo('user')
);

router
  .route('/')
  .post(
    protected, 
    allowedTo('user'), 
    createReviewValidator,  
    createReview
  )


router
  .route('/:id')
  .get(
    protected , 
    allowedTo('user') , 
    getReviewValidator,
    getReview
  )
  .delete(
    protected, 
    allowedTo('user' , 'admin'), 
    deleteReviewValidator, 
    deleteReview
  )
  .put(
    protected,
    allowedTo('user'), 
    updateReviewValidator, 
    updateReview
  );

module.exports = router;