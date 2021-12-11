const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
	try {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	} catch (error) {
		throw new Error('Hashing failed', error);
	}
};

module.exports = hashPassword;
