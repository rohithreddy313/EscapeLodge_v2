const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true,useCreateIndex: true,useUnifiedTopology: true})
    .then(()=>{
        console.log('db connected');
    })
    .catch(()=>{
        console.log('error connecting')
    })

const sample = array=> array[Math.floor(Math.random() * array.length)]
const price = Math.floor(Math.random()*20)+10
const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0 ; i<=300; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            price,
            author:'60d9c736fd1d04078603131e',
            description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})



