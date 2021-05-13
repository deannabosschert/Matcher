const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../models/user.js");
const userController = {};

userController.home = (req, res) => {
	if (!req.user) {
		return res.render("home");
	}

	User.find((err, content) => {
		return res.render("secret", { user: req.user, content: content });
	});
};

userController.register = (req, res) => {
	res.render("register");
};

userController.doRegister = (req, res) => {
	User.register(
		new User({
			username: req.body.username,
			loc: {
				type: "Point",
				coordinates: [Number(req.body.lng), Number(req.body.lat)],
			},
			age: req.body.age,
			name: req.body.name,
		}),
		req.body.password,
		(err) => {
			if (err) {
				return res.render("register", {
					err: "Something went terribly wrong ¯\\_(ツ)_/¯",
				});
			}

			passport.authenticate("local")(req, res, () => {
				res.redirect("/");
			});
		}
	);
};

userController.login = (req, res) => {
	res.render("login");
};

userController.doLogin = (req, res) => {
	passport.authenticate("local")(req, res, () => {
		res.redirect("/");
	});
};

userController.logout = async (req, res) => {
	req.logout();
	req.session.destroy();
	res.redirect("/");
};

userController.profile = (req, res) => {
	User.findOne({ username: req.params.username }, (err, profile) => {
		if (err) {
			return res.redirect("/");
		}

		let userProfile = false;
		if (req.user) {
			userProfile = req.params.username === req.user.username;
		}

		return res.render("profile", {
			profile: profile,
			user: req.user,
			owner: userProfile,
		});
	});
};

userController.editProfile = (req, res) => {
	let userProfile = false;
	let lng;
	let lat;

	if (req.user) {
		userProfile = req.params.username === req.user.username;
		lng = req.user.loc.coordinates[0];
		lat = req.user.loc.coordinates[1];
	}

	if (userProfile) {
		return res.render("edit", {
			user: req.user,
			lng: lng,
			lat: lat,
		});
	} else {
		res.redirect("/profile/" + req.params.username);
	}
};

userController.updateProfile = (req, res) => {
	const update = {
		loc: {
			type: "Point",
			coordinates: [Number(req.body.lng), Number(req.body.lat)],
		},
		age: req.body.age,
		name: req.body.name,
	};
	const filter = { username: req.user.username };
	User.findOneAndUpdate(filter, update, (err, result) => {
		if (result) {
			return res.redirect("/profile/" + req.user.username);
		}
	});
};

module.exports = userController;