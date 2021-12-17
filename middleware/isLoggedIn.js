const IsloggedIn = (req, res, next) => {
	if (req.session.user) {
		next()
	} else {
		res.status(401).json({
			error: true,
			message: 'You have to be Loggedin to perform this Action',
		})
	}
}

module.exports = IsloggedIn
