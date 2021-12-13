const express = require('express'),
	bodyparser = require('body-parser'),
	cookieparser = require('cookie-parser'),
	User = require('./models/UserDetails'),
	connectDB = require('./db/connect'),
	apiRoute = require('./routes')

const app = express();
const mongoose = require('mongoose');
const path = require('path')
app.set('view engine', 'ejs')

//passport
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const LocalStrategy = require('passport-local')
const connectEnsureLogin = require('connect-ensure-login')
// RUNS THE CONNECTION TO THE MONGODB SERVER 

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.json());
app.use(cookieparser());
connectDB();
// ======= USER SIGN UP ========
app.get('/', (req, res) => {
	res.render('index')
})
app.use(apiRoute)







app.listen(8080, () => {
	console.log('Backend App running on port 8080 Aieges');
});


