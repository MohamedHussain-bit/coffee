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
    protected ,
    allowedTo
} = require('../services/authServices');

router
  .route('/')
  .post(protected, allowedTo('user'), createReview)


router
  .route('/:id')
  .get(getReview)
  .delete(protected, allowedTo('user' , 'admin'), deleteReview)
  .put(protected, allowedTo('user'), updateReview);

module.exports = router;