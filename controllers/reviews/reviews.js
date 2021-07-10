const Campground = require('../../models/campground');
const Review = require('../../models/reviews');

module.exports.newReview = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    const review = new Review(req.body);
    review.author = req.user._id
    campground.reviews.push(review)
    await campground.save();
    await review.save();
    req.flash('success','successfully added review')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}