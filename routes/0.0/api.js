var express = require('express');
var router = express.Router();
var usersRouter = require('./users');
var postsRouter = require('./posts');
var authenticationRouter = require('./authentication');

var jwt = require('express-jwt');
var app = express();

var auth = jwt({
    // MUST ATTEND TO ASAP
    secret: 'MY_SECRET',
    userProperty: 'payload',
  });

// app.use('/',function(req,res){res.send('hello this is root of api v0')});
app.use('/users',usersRouter);
app.use('/posts',postsRouter);
app.use('/authenticate',authenticationRouter);

module.exports = app;
