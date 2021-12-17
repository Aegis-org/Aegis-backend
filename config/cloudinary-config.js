require('dotenv/config')
const cloudinary = require('cloudinary').v2
const multer = require('multer')

// configuration
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	secret_key: process.env.CLOUD_API_SECRET,
	secure: true,
})

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.filename + '-' + Date.now())
	},
})

let upload = multer({ storage: storage })

module.exports = upload
