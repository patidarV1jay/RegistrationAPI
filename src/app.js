require("dotenv").config()
const express = require("express")
const path = require('path')
require('./db/connection')
const hbs = require("hbs")
const EmployersData = require("./model/registration")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()
const port = process.env.PORT || 3000 
const staticPath = path.join(__dirname,"../public")
const viewPath = path.join(__dirname,"../templates/views")
const partialsPath = path.join(__dirname,"../templates/partials")
app.use(express.static(staticPath))
app.set("view engine","hbs")
app.set("views",viewPath)
hbs.registerPartials(partialsPath)
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.get('/',(req,res)=>{
    res.render("index")
})
app.get('/login',(req,res)=>{
    res.render("login")
})
app.post('/login',async(req,res)=>{
    try{
        const {email, password} = req.body
        const employee = await EmployersData.findOne({email})
        const  isValid = await bcrypt.compare(password, employee.password)
        console.log(isValid)
        const token = await employee.generateToken()
        console.log(token,"login")
        isValid ? res.render("index") : res.status(400).send("invalid credentials")
    }
    catch(e){
        console.log('error')
        res.status(400).send("not valid credentials")
    }
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.post("/register",async(req,res)=>{
    try{
        const {password,confirmPassword} = req.body
        if(password ===confirmPassword){
            const addEmployee= new EmployersData(req.body)
            console.log(addEmployee,'addemployee')
            const token = await addEmployee.generateToken()
            console.log(token)
            const employee = await addEmployee.save()
            console.log(employee,"employee")
            res.status(200).render("index")
        }
        else{
            res.status(400).send("password do no match")
        }
    }
    catch(e){
        console.log("app register post")
        res.status(400).send(e)
    }
})

// const hashPassword = async(password) =>{
//     try{
//         const saltText =await bcrypt.genSalt(10)
//         console.log(saltText,"salt")
//         const saltHash = await bcrypt.hash(password,saltText)
//         console.log(saltHash,'saltHash')
//     }
//     catch(e){
//         console.log(e)
//     }
    
//     const hashedPassword = await bcrypt.hash(password,10)
//     console.log(hashedPassword,"hashedpassword")
//     const passwordCheck = await bcrypt.compare(password, hashedPassword)
//     console.log(passwordCheck)
// }
// hashPassword("new")

// const createToken = async() =>{
//   const token =  jwt.sign({_id:445792655},"jsonwebtoken",{expiresIn:"20  seconds"})
//   console.log(token)

//   const tokenVerify = jwt.verify(token,"jsonwebtoken")
//   console.log(tokenVerify)
// }

// createToken()



app.listen(port,() =>{
    console.log("connection successful to port "+port+".....")
})
