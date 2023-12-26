const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Route to write a movie review
router.post('/write-review/:movieId', (req, res) => {
  const { movieId } = req.params;
  const { reviewText, rating } = req.body;

  const newReview = new Review({
    movieId,
    reviewText,
    rating,
  });

  newReview
    .save()
    .then(() => {
      res.json({ message: 'Review submitted successfully' });
    })
    .catch((error) => {
      console.error('Error submitting review:', error);
      res.status(500).json({ error: 'Error submitting review' });
    });
});

// Route to fetch movie reviews by movieId
// router.get('/movie-reviews/:movieId', (req, res) => {
//   const { movieId } = req.params;
//   Review.find({ movieId })
//     .then((reviews) => {
//       res.json(reviews);
//     })
//     .catch((error) => {
//       console.error('Error fetching movie reviews:', error);
//       res.status(500).json({ error: 'Error fetching movie reviews' });
//     });
// });
// Import necessary modules and models

// Route to delete a review by review ID
router.delete('/delete-review/:reviewId', (req, res) => {
  const { reviewId } = req.params;

  // Use the Review model to find and delete the review
  Review.findByIdAndDelete(reviewId)
    .then((deletedReview) => {
      if (!deletedReview) {
        // If the review with the given ID is not found
        res.status(404).json({ message: 'Review not found' });
      } else {
        // Review deleted successfully
        res.json({ message: 'Review deleted successfully' });
      }
    })
    .catch((error) => {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Error deleting review' });
    });
});

// New route to fetch all reviews and ratings for a specific movie
router.get('/all-reviews-ratings/:movieId', (req, res) => {
  const { movieId } = req.params;
  Review.find({ movieId })
    .then((reviews) => {
      res.json(reviews);
    })
    .catch((error) => {
      console.error('Error fetching all reviews and ratings:', error);
      res.status(500).json({ error: 'Error fetching all reviews and ratings' });
    });
});
module.exports = router;
