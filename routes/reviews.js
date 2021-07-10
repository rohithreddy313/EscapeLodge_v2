const express  = require('express');
const router = express.Router({ mergeParams: true });
const {isLoggedIn,isReviewAuthor,validateReview} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews/reviews')


router.post('/',isLoggedIn,validateReview,catchAsync(reviews.newReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))


module.exports = router