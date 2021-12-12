const express = require('express')
const Router = express.Router()
const User = require('../models/UserDetails')
const bcrypt = require('bcrypt')
const passport = require('passport')



// Post Sigup  Route
Router.post("/api/user/signup", (req, res) => {
    const newUser = new User(req.body);
    User.find(
        { email: newUser.email, username: newUser.username },
        function (err, user) {
            if (user.email) {
                return res
                    .status(400)
                    .json({ auth: false, message: 'email already exists' });
            } else if (user.username) {
                return res
                    .status(400)
                    .json({ auth: false, message: 'username already exists' });
            }

            newUser.save((err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ success: false });
                }
                res.status(200).json({
                    success: true,
                    user: doc,
                });
            });
        }
    );
})

// Login Route 



Router.post('/api/users/login', async (req, res, next) => {
    const loginUser = req.body
    const user = await User.findOne({ username: loginUser.username })
    if (user) {

        const validPassword = await bcrypt.compare(loginUser.password, user.password)
        if (validPassword) {

            res.status(200).json({ login: true, message: "Successfully Loggedin" })
        }
        else {
            res.status(400).json({ login: false, message: "Invalid Password" })
        }

    }
    else {
        res.status(401), json({ login: false, message: "Invalid Username" })
    }

})


module.exports = Router