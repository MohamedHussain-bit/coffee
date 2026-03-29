const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
    },
}, {timestamps: true});

module.exports = mongoose.model('Review', reviewSchema);