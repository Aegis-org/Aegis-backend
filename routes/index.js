const express = require('express')
const Router = express.Router()
const User = require('../models/UserDetails')
const bcrypt = require('bcrypt')
const passport = require('passport')
const expressSession = require('express-session')
const axios = require('axios')
const config =require("../config/axios-config")
const { json } = require('body-parser')

// IMPORT LOAD
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

Router.use(expressSession({
    secret: 'jnjrefnj',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}))

// Post Sigup  Route TO SIGNUP A USER I.E CREATE A USER AND ADD IN THE DATABASE
Router.post("/api/users/signup", (req, res) => {
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

// Login Route  TO LOGIN AN ALREADY CREATED USER IF NO USER NO LOGIN

Router.post('/api/users/login', async (req, res, next) => {
    const loginUser = req.body
    const user = await User.findOne({ username: loginUser.username })
    if (user) {
        const validPassword = await bcrypt.compare(loginUser.password, user.password)
        if (validPassword) {
            session = req.session
            session.user = user;
        
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

// TO DELETE SESSION CREATED WHEN LOGGED IN 
Router.post("/api/users/logout",(req,res)=>{
    req.session.destroy();
    res.status(201).json({logout:true,message:"Sucessfully Logout"})
})

// A PUT REQUEST TO UPDATE INFORMATION FROM THE DATABASE 
Router.put('/api/users/edit',(req,res)=>{
  
  session = req.session
  userdetails =  session.user
  let url = process.env.BVNAPI
    let options = {
        method: 'POST',
        body:JSON.stringify(req.body),
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.TESTAPIKEY
        }

    };
    // A LOGIC TO UPDATE THE USER NIN FROM THE DATABASE
    const updateLogic = ()=>{User.findOneAndUpdate({ email: userdetails?.email }, { nin: req.body.number }, (err, updated) => {
        if (err) {
            res.status(401), json({ login: false, message: "Login to Make this request" })
        }
        else if (updated) {
            res.status(201).json({ edited: true, message: 'Nin Updated' })
        }
        else {
            res.status(401).json({ edited: false, message: 'Error Occured Somewhere' })
        }
    })
}

//    Setup fetch request 
    fetch(url, options)
        .then(res => res.json())
        .then(json =>{
         updateLogic()   
        })
        .catch(err => console.error('error:' + err));
})

module.exports = Router