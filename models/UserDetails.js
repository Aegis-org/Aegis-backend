const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Schema to Define what information the Users will have
const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		trim: true,
		required: ['true', 'first name is required'],
	},
	lastName: {
		type: String,
		trim: true,
		required: ['true', 'last name is required'],
	},
	username: {
		type: String,
		required: ['true', 'username is required'],
		unique: true,
	},
	validIdentity: {
		type: String,
		trim: true,
	},
	email: {
		type: String,
		required: ['true', 'email is required'],
		trim: true,
		unique: true,
	},
	phoneNumber: {
		type:String,
		required:['true','Phone Number is Required']
	},
	password: {
		type: String,
		required: ['true', 'password cannot be less than 8 characters'],
		minlength: 8
	},
	nextofkinNin: {
		type: String,
		minlength:10,
	},
	nin: {
		type: String,
		trim: false,
		unique: false,
		default: 0
	},
	bvn:
	{
		type:Number

	},
	verified:
	{
		type: Boolean,
		default: false,
	},
	vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
});

UserSchema.pre('save', async function () {
	if (!this.password || !this.isModified('password')) return;

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const UsersModel = mongoose.model('Buyer', UserSchema);
module.exports = UsersModel;
