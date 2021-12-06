const   express             =       require('express'),
        mongoose            =       require('mongoose'),
        passport            =       require('passport'),
        path                =       require('path');

const app = express();

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

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'aigis/index.html'))
})

app.listen(8080, () => {
	console.log('Backend App running on port 8080 Aieges');
});
