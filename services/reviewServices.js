const Review = require('../models/reviewSchema');
const handlerFactory = require('./handlerFactory');

// @desc     Create review
// @route    POST /api/v1/reviews
// @access   Private
exports.createReview = handlerFactory.createOne(Review);

// @desc     Get all reviews
// @route    GET /api/v1/reviews
// @access   Private
//exports.getAllReviews = handlerFactory.getAll(Review);

// @desc     Get specific review
// @route    GET /api/v1/reviews/:id
// @access   Private
exports.getReview = handlerFactory.getOne(Review);

// @desc     Delete review
// @route    DELETE /api/v1/reviews/:id
// @access   Private
exports.deleteReview = handlerFactory.deleteOne(Review);

// @desc     Update review
// @route    PUT /api/v1/reviews/:id
// @access   Private
exports.updateReview = handlerFactory.updateOne(Review);