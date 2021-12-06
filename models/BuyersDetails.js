const mongoose = require('mongoose')


// Schema to Define what information the Buyers will have

const BuyersSchema = new mongoose.Schema(
    {
        firstname: String,
        lastName: String,
        middle: String,
        username: String,
        validIdentity: String,
        nin: Number,
        email: String,
    }
)

const BuyersModel = mongoose.model('Buyer', BuyersSchema)


module.exports = BuyersModel;