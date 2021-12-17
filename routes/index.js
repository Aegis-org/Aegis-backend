const express = require('express');
const Router = express.Router();
const userApi = require('./api')
const vehicleApi = require('./vehicleApi')

// IMPORT LOAD


// Post Sigup  Route TO SIGNUP A USER I.E CREATE A USER AND ADD IN THE DATABASE

//    Setup fetch request
Router.use('/api/users',userApi)
Router.use('/api/users/vehicles',vehicleApi)

module.exports = Router;
