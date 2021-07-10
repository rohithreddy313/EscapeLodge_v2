if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodoverride = require('method-override'); 
const expressError = require('./utils/expressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user')
const MongoDBStore = require("connect-mongo");

const dbUrl = process.env.dbUrl || 'mongodb://localhost:27017/yelp-camp'
const secret = process.env.SECRET || 'thisisasecret'

const reviews = require('./routes/reviews')
const campgrounds = require('./routes/campgrounds')
const user = require('./routes/user')

mongoose.connect(dbUrl, {useNewUrlParser: true,useCreateIndex: true,useUnifiedTopology: true,useFindAndModify: false})
    .then(()=>{
        console.log('db connected')
    })
    .catch(()=>{
        console.log('error connecting')
    })

app.set('view engine', 'ejs');
app.engine('ejs',ejsMate)
app.set('views' , path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method'));

const store = new MongoDBStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

app.use(session({
    store,
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/',(req,res)=>{
    res.render('home')
});

app.use('/',user);

app.use('/campgrounds',campgrounds)


app.use('/campgrounds/:id/reviews/',reviews)




app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err,statusCode})
})


app.listen(3000,()=>{
    console.log('server started')
})