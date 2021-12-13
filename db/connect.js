require("dotenv").config()
const mongoose = require('mongoose');

const url = process.env.DATABASE

const connectDB = async () => {
	try {
		await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`MongoDB Connected: ${url}`);
	} catch (err) {
		console.error(err);
	}
};

module.exports = connectDB;
