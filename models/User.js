var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

const Post = require('./Post');
const Friend = require('./Friend');
const Follower = require('./Follower');
const Favorite = require('./Favorite');

var userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true,
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true,
    },
    bio:{
      type: String
    },
    handle: {
        type: String,
        unique: true,
        required: true,
    },
    email:{
      type: String,
      unique: true,
      required: true,
    },
    joinDate:{
      type: Date,
      required: true
    },
    location: String,
    postCount: String,
    followerCount:String,
    friendCount:String,
    likeCount:String,
    hash: String, // the encrypted password
    salt: String,
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.updateCount = function(){

  // let user = this;
  console.log('updating counts');
  console.log(`User ID is ${this._id}`);
  Post.count({authorId: this._id},(err,item)=>{
    this.postCount = item;
    this.save();
  });

  Follower.findOne({userId: this._id},(err,item)=>{
    console.log('the returned follower item');
    console.log(item);
    if(item===null){
      return;
    }
    else{
      this.followerCount = item.followerList.length;
      this.save();
    }
  });

  Friend.findOne({userId: this._id},(err,item)=>{
    console.log(`friend count is ${item.friendList.length}`);
    this.friendCount = item.friendList.length;
    this.save();
  });

  Favorite.findOne({userId: this._id},(err,item)=>{
    this.likeCount = item.favoriteList.length;
    this.save();
  });

  
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    handle: this.handle,
    firstname: this.name,
    lastname:this.name,
    favList:this.favList,
    exp: parseInt(expiry.getTime() / 1000),
  }, 'MY_SECRET'); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

var User = mongoose.model('users', userSchema);
module.exports = User;
