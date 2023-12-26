const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
 
  movieId: {
    type: String,
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
