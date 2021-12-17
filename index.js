require('dotenv').config()
const express = require('express'),
	bodyparser = require('body-parser'),
	cookieparser = require('cookie-parser'),
	User = require('./models/UserDetails'),
	connectDB = require('./db/connect'),
	apiRoute = require('./routes'),
	config = require('./config/axios-config');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");
const corsOrigins = {
	origin: ['http://localhost:3000']
}
app.set('view engine', 'ejs');
//passport
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const connectEnsureLogin = require('connect-ensure-login');
// Using the Packages  for the backend 

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use(bodyparser.json());
app.use(cookieparser());
app.use(cors(corsOrigins))
connectDB();
// ======= USER SIGN UP ========
app.use(apiRoute);

app.get('/', (req, res) => {
	res.render("index.ejs");
})

app.listen(process.env.PORT, () => {
	console.log(`THe app is running on PORT ${process.env.PORT}`)
})