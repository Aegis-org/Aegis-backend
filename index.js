const express = require('express'),
	bodyparser = require('body-parser'),
	cookieparser = require('cookie-parser'),
	User = require('./models/UserDetails'),
	connectDB = require('./db/connect');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieparser());

app.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, 'aigis/index.html'));
});

// ======= USER SIGN UP ========
app.post('/api/user/signup', (req, res) => {
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
					return res.status(400).json({ success: false });
				}
				res.status(200).json({
					succes: true,
					user: doc,
				});
			});
		}
	);
});

app.listen(8080, () => {
	console.log('Backend App running on port 8080 Aieges');
});

connectDB();
