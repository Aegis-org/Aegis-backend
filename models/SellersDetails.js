const mongoose = require('mongoose');

const SellerSchema = mongoose.Schema({
	firstname: String,
	lastName: String,
	middle: String,
	username: String,
	validIdentity: String,
	nin: Number,
	email: String,
});

const SellerModel = mongoose.model('Seller', SellerSchema);

export default SellerModel;
