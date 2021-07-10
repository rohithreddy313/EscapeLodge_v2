const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users/users')


router.route('/register')
    .get(users.registerGET)
    .post(catchAsync(users.registerPOST));

router.route('/login')
    .get(users.loginGET)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginPOST)

router.get('/logout', users.logout)

module.exports = router;