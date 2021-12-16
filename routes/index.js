const express = require('express')
const Router = express.Router()
const User = require('../models/UserDetails')
const Vehicle = require('../models/VehicleDetails')
const bcrypt = require('bcrypt')
const passport = require('passport')
const expressSession = require('express-session')
const axios = require('axios')
const config = require('../config/axios-config')
const { json } = require('body-parser')

// IMPORT LOAD
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

Router.use(
	expressSession({
		secret: 'jnjrefnj',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 60 * 60 * 1000 },
	})
)

// Post Sigup  Route TO SIGNUP A USER I.E CREATE A USER AND ADD IN THE DATABASE
Router.post('/api/users/signup', async (req, res) => {
	const newUser = new User(req.body)
	try {
		const foundUser = await User.findOne({
			email: newUser.email,
			username: newUser.username,
		})
		if (foundUser) {
			res.status(401).json({
				error: true,
				message: 'Username or Email Already Exist',
			})
		} else {
			const user = await newUser.save()
			res.status(200).json({
				error: false,
				message: 'User Created Successfully',
			})
		}
	} catch {
		res.status(400).json({ message: 'An Error Occured Try Again' })
	}
})

// Login Route  TO LOGIN AN ALREADY CREATED USER IF NO USER NO LOGIN
Router.post('/api/users/login', (req, res, next) => {
	const loginUser = req.body
	User.findOne(
		loginUser['email'].includes('@')
			? { email: loginUser?.email }
			: { username: loginUser?.email },
		async (err, found) => {
			if (found === null) {
				res.status(400).json({ login: false, message: 'Invalid Username' })
			} else {
				const validPassword = await bcrypt.compare(
					loginUser.password,
					found.password
				)

				if (validPassword) {
					session = req.session
					session.user = found

					res.status(200).json({
						login: true,
						message: 'Successfully Loggedin',
					})
				} else {
					res.status(400).json({
						login: false,
						message: 'Invalid Password',
					})
				}
			}
		}
	)
})

// TO DELETE SESSION CREATED WHEN LOGGED IN
Router.post('/api/users/logout', (req, res) => {
	req.session.destroy()
	res.status(201).json({ logout: true, message: 'Sucessfully Logout' })
})

// A PUT REQUEST TO UPDATE INFORMATION FROM THE DATABASE
Router.put('/api/users/edit', async (req, res) => {
	// For a user to edit Nin and Bvn
	let session = req.session
	let user = req.session?.user
	let body = req.body
	let updating = {
		nin: req.body.nin,
		bvn: req.body.bvn,
		nextofkinNin: req.body.nextofkinNin,
	}
	try {
		if (user) {
			const response = await fetch(process.env.NINAPI, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': process.env.TESTAPIKEY,
				},
				body: JSON.stringify({ number: parseInt(req.body.nin) }),
			})

			const json = await response.json()

			if (json.status) {
				const updated = await User.findOneAndUpdate(
					{ username: user.username },
					updating,
					{ returnOriginal: false }
				)
				console.log(json)
				return res
					.status(201)
					.json({ verified: true, message: `${json.detail} and Updated` })
			} else if (!json.status) {
				return res
					.status(401)
					.json({ verified: false, message: 'Your NIN Cant be verified' })
			}
		} else if (!user) {
			console.log('No User')
			return res.status(401).json({
				error: true,
				message: 'You cannot edit because you are not logged in',
			})
		}
	} catch (err) {
		console.log(err)
		return res.sendStatus(501).json({ error: true, message: 'Error Occured' })
	}
})

//    Setup fetch request

// Route to get the current logged in user details
Router.post('/api/users/details', (req, res) => {
	const session = req.session
	const user = session.user
	if (!user) {
		res.status(401).json({ message: `There's Currently no logged in user` })
	} else {
		res.status(200).json({ user: user })
	}
})

// find all user vehicles
Router.get('/api/user/:username/vehicles', (req, res) => {
	let foundUserVehicle = User.find({ name: req.params.username }).populate(
		'vehicle'
	)
	res.json(foundUserVehicle)
})

// find user by id
Router.get('/api/users/:id', (req, res, id) => {
	const user = User.findById(id)
	if (!user) {
		res.status(404).json({ message: `User${id} not found` })
	} else {
		res.status(200).json({ user: user })
	}
})

// create new product
Router.post('/api/user/create', async (req, res) => {
	try {
		let newUser = new Vehicle(req.body)
		let savedUser = newUser.save()

		res.status(200).json(savedUser)
	} catch (err) {
		res.status(400).json({ message: 'Cannot create new vehicle' })
	}
})

module.exports = Router
