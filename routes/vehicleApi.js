const express = require('express');
const Router = express.Router();
const upload = require('../config/cloudinary-config');
const User = require('../models/UserDetails');
const userApi = require('./api')
const Vehicle = require('../models/VehicleDetails');
const bcrypt = require('bcrypt');
const expressSession = require('express-session');
const { json } = require('body-parser');
const IsloggedIn = require('../middleware/isLoggedIn');
const cloudinary = require('cloudinary').v2;


// Route to get the current logged in user details

// find a particlular  user vehicles that the user posted

// create new product
Router.post(
    '/create',
    upload.single('vehicleImage'),
    IsloggedIn,
    async (req, res) => {
        let currentUser = req.session.user;
        let newVehicle = req.body;
        let image = req.file.path;
        try {
            const currentUserSchema = await User.findOne({
                username: currentUser.username,
            });
            if (currentUserSchema) {
                const result = await cloudinary.uploader.upload(image);
                if (!result) {
                    res.status(400).json({ message: 'Could not upload Image', error: true })
                }
                const vehicleCreated = await Vehicle.create({
                    ...newVehicle,
                    owner: currentUserSchema,
                    vehicleImage: result.secure_url
                });

                if (vehicleCreated) {
                    await currentUserSchema.vehicles.push(vehicleCreated);
                    await currentUserSchema.save();
                    res.status(200).json({
                        error: false,
                        message: 'Vehicle Successfully Created',
                        vehicleCreated,
                        image: result.secure_url,
                    });
                }
                else {
                    res.status(501).json({ message: `An Error occur there's another vehicle with that vin Number`, error: true })
                }
            }
        } catch (err) {
            if (err.code === 11000) {
                res.status(400).json({ message: `There's another Vehicle with this same VIN Number` })
            }
            res.status(400).json({ message: 'Cannot create new vehicle' });
        }
    }
);

module.exports = Router