const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/aegis';

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
