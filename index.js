const   express             =       require('express'),
        mongoose            =       require('mongoose')
const app = express();
// Connection to Mongoose
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

connectDB();

app.listen(8080, () => {
	console.log('Backend App running on port 8080 Aieges');
});
