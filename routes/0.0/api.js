var express = require('express');
var app = express();

var usersRouter = require('./users');
var postsRouter = require('./posts');
var authenticationRouter = require('./authentication');
var followersRouter = require('./followers');
var friendsRouter = require('./friends');
var friendshipsRouter = require('./friendships');
var likesRouter = require('./likes');
var accountRouter = require('./account');
var favoritesRouter = require('./favorites');
var jwt = require('express-jwt');

var auth = jwt({
    // MUST ATTEND TO ASAP
    secret: 'MY_SECRET',
    userProperty: 'payload',
  });

// app.use('/',function(req,res){res.send('hello this is root of api v0')});
app.use('/users',usersRouter);
app.use('/posts',postsRouter);
app.use('/authenticate',authenticationRouter);
app.use('/followers',followersRouter);
app.use('/friends',friendsRouter);
app.use('/likes',likesRouter);
app.use('/friendships', auth, friendshipsRouter);
app.use('/account', auth, accountRouter);
app.use('/favorites', auth, favoritesRouter);

module.exports = app;
