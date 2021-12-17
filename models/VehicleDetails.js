const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const VehicleSchema = mongoose.Schema(
	{
		vehicleImage: {
			type: String,
			required: true,
		},
		vehicleNumber: {
			type: String,
			unique: true,
			required: ['true', 'the vehicle number is required'],
			minlength: 9,
		},
		vehicleName: {
			type: String,
			required: ['true', 'the vehicle name is required'],
		},
		vehicleColor: {
			type: String,
		},
		vehicleMakeYear: {
			type: Number,
			required: ['true', 'vehicle make year is required'],
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
)
	mongoose.plugin(mongoosePaginate)
const VehicleModel = mongoose.model('Vehicle', VehicleSchema)

module.exports = VehicleModel
