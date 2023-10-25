const jwt = require("jsonwebtoken")
const EmployersData = require("../model/registration")
const express = require("express")
const hbs = require('hbs')

const app = express()
app.set("view engine","hbs")

const auth = async(req,res,next)=>{
    try {
        console.log(req,'pre')
        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY)
        // console.log(verifyUser,'verify user')
        const logInEmployee = await EmployersData.findOne({_id:verifyUser._id})
        // console.log(logInEmployee,'loginemployee')
        req.logInEmployee = logInEmployee
        req.token = token
        console.log(req,"post")
        next()
    } catch (error) {
        res.status(400).render("login")
    }
}

module.exports = auth
 