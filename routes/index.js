const express = require('express');
const Router = express.Router();
const User = require('../models/UserDetails');
const bcrypt = require('bcrypt');
const passport = require('passport');
const expressSession = require('express-session');
const axios = require('axios');
const config = require('../config/axios-config');
const { json } = require('body-parser');

// IMPORT LOAD
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

Router.use(
	expressSession({
		secret: 'jnjrefnj',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 60 * 60 * 1000 },
	})
);

// Post Sigup  Route TO SIGNUP A USER I.E CREATE A USER AND ADD IN THE DATABASE
Router.post('/api/users/signup', (req, res) => {
	const newUser = new User(req.body);
	User.find(
		{ email: newUser.email, username: newUser.username },
		function (err, user) {
			if (user.email) {
				return res
					.status(400)
					.json({ auth: false, message: 'email already exists' });
			} else if (user.username) {
				return res
					.status(400)
					.json({ auth: false, message: 'username already exists' });
			}

			newUser.save((err, doc) => {
				if (err) {
					console.log(err);
					return res
						.status(400)
						.json({ auth: false, message: `${err.keyValue.username || err.keyValue.email} already exists in our database try another value` })
				}
				res.status(200).json({
					success: true,
					user: doc,
				});
			});
		}
	);
});

// Login Route  TO LOGIN AN ALREADY CREATED USER IF NO USER NO LOGIN

Router.post('/api/users/login', (req, res, next) => {
	const loginUser = req.body;
	User.findOne({ username: loginUser.username },
		async (err, found) => {
			if (found === null) {
				console.log('error occured')
				res.status(401).json({ login: false, message: 'Invalid Username' });
			}
			else {

				const validPassword = await bcrypt.compare(
					loginUser.password,
					found.password
				);

				if (validPassword) {
					session = req.session;
					session.user = found;

					res.status(200).json({
						login: true,
						message: 'Successfully Loggedin',
					});
				} else {
					res.status(400).json({ login: false, message: 'Invalid Password' });
				}
			}
		}
	);

});

// TO DELETE SESSION CREATED WHEN LOGGED IN
Router.post('/api/users/logout', (req, res) => {
	req.session.destroy();
	res.status(201).json({ logout: true, message: 'Sucessfully Logout' });
});

// A PUT REQUEST TO UPDATE INFORMATION FROM THE DATABASE
Router.put('/api/users/edit', (req, res) => {
	session = req.session;
	userdetails = session.user;
	let url1 = process.env.BVNAPI;
	let url2 = process.env.NINAPI
	let options = {
		method: 'POST',
		body: JSON.stringify(req.body),
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': process.env.TESTAPIKEY,
		},
	};

	url1 = axios.post(url1,options)
	url2 = axios.post(url2,options)
	// A LOGIC TO UPDATE THE USER NIN FROM THE DATABASE
	const updateLogic = () => {		
		if (!userdetails) {
			res.status(401).json({ message: "You Have to Login First", edited: false })
		}
		else {
			User.findOneAndUpdate(
				{ username: userdetails?.username },
				{ nin: req.body.number, nextofkinNin: req.body.noknin, bvn: req.body.bvn },
				async (err, updated) => {
					if (err) {
						res.status(401),
							json({ login: false, message: 'Login to Make this request' });
					} else if (updated) {
						const verified = await User.findOneAndUpdate({ username: userdetails?.username }, { verified: true },)
						if (verified) {
							res.status(201).json({ edited: true, message: 'Details Updated' });
						}
						else {
							res.status(501).json({ edited: false, message: 'Error Occured' })
						}

					} else {
						res.status(401).json({
							edited: false,
							message: 'Error Occured Somewhere',
						});
					}
				}
			);
		}
	}

	Promise.all([url1,url2])
	.then(res=>console.log(res))
	.catch(err=>console.log(err))
})

	//    Setup fetch request


// Route to get the current logged in user details 
Router.post('/api/users/details', (req, res) => {
	const session = req.session
	const user = session.user
	if (!user) {
		res.status(401).json({ message: `There's Currently no logged in user` })
	}
	else {
		res.status(200).json({ user: user })
	}
})
// find all user vehicles details
Router.get('/api/user/:username/vehicles', (req, res) => {
	let foundUserVehicle = User.find({ name: req.params.username }).populate(
		'vehicle'
	);
	res.json(foundUserVehicle);
})

module.exports = Router