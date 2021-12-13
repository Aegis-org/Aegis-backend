const mongoose = require('mongoose');

const VehicleSchema = mongoose.Schema(
	{
		vehicleNumber: {
			type: String,
			unique: true,
			required: ['true', 'the vehicle number is required'],
		},
		vehicleName: {
			type: String,
			required: ['true', 'the vehicle name is required'],
		},
		vehicleColor: {
			type: String,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

const VehicleModel = mongoose.model('Seller', VehicleSchema);

export default VehicleModel;
