const express = require('express'),
	bodyparser = require('body-parser'),
	cookieparser = require('cookie-parser'),
	User = require('./models/UserDetails'),
	connectDB = require('./db/connect'),
	apiRoute = require('./routes');

const app = express();
const mongoose = require('mongoose');
const path = require('path');
app.set('view engine', 'ejs');

//passport
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const connectEnsureLogin = require('connect-ensure-login');

const url = 'mongodb://127.0.0.1:27017/aegis';

// const connectDB = async () => {
// 	try {
// 		await mongoose.connect(url, {
// 			useNewUrlParser: true,
// 			useUnifiedTopology: true,
// 		});
// 		console.log(`MongoDB Connected: ${url}`);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

// const connectEnsureLogin = require('connect-ensure-login');

// connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieparser());

// ======= USER SIGN UP ========
app.use(apiRoute);

app.get('/api/docs', (req, res) => {
	res.render(path.join(__dirname, 'aigis/index'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => {
	console.log('Backend App running on port 8080 Aieges');
});
