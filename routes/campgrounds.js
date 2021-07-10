const express = require('express');
router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds/campgrounds')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post( isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.newCampgroundPost))
    // .post(upload.array('image'),(req,res)=>{
    //     console.log(req.body.campground, req.files);
    //     res.send('it worked')
    // })

router.get('/new',isLoggedIn,campgrounds.newForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground, catchAsync(campgrounds.editPUTCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.editGETCampground))



module.exports = router;