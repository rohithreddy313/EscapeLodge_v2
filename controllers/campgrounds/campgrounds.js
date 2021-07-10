const Campground = require('../../models/campground');
const {cloudinary} = require('../../cloudinary')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });



module.exports.index = async(req,res)=>{
    const campground = await Campground.find({})
    res.render('campgrounds/index',{campground})
}

module.exports.newForm = async(req,res)=>{
    res.render('campgrounds/new')
}

module.exports.newCampgroundPost = async (req, res, next) => {
    geoco = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 2
      })
        .send()

    const newcamp = await new Campground(req.body);
    newcamp.geometry = geoco.body.features[0].geometry
    newcamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newcamp.author = req.user._id
    await newcamp.save();
    console.log(newcamp)
    req.flash('success', 'Successfully made a new campground!');
    res.redirect('/campgrounds')
}

module.exports.showCampground = async(req,res)=>{
    const found = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!found) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { found });
}

module.exports.editGETCampground = async(req,res)=>{
    const {id} = req.params;
    const found = await Campground.findById(id);
    if (!found) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{found})
}


module.exports.editPUTCampground = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteCampground  = async(req,res)=>{
    const {id} = req.params;
    const deleted = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground')
    res.redirect('/campgrounds')
}