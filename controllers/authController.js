const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../models/user.js");
const userController = {};

userController.home = (req, res) => {
    if (!req.user) {
      return res.render('home');
    }

    User.find((err, content) => {
      return res.render('secret', { user : req.user, content: content });
    })
};

userController.register = (req, res) => {
  res.render('register');
};

userController.doRegister = (req, res) => {
  User.register(new User({ 
    username : req.body.username,
    loc: { 
      type: "Point",
      coordinates: [Number(req.body.lng), Number(req.body.lat)]
    },
    age: req.body.age,
    name: req.body.name }),
    req.body.password, (err) => {

    if (err) {
      return res.render('register', { err: err});
    }

    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  });
};

userController.login = (req, res) => {
  res.render('login');
};

userController.doLogin = (req, res) => {
  passport.authenticate('local')(req, res, () => {
    res.redirect('/');
  });
};

userController.logout = async (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
};

userController.profile = (req, res) => {
  return res.render('profile');
}

userController.updateProfile = async (req, res) => {
  const update =  {
  loc: { 
    type: "Point",
    coordinates: [Number(req.body.lng), Number(req.body.lat)]
  },
  age: req.body.age,
  name: req.body.name }
  const filter = {username : req.body.username}
  User.findOneAndUpdate(filter, update, { new: true });

  return res.render('profile')
}

module.exports = userController;
