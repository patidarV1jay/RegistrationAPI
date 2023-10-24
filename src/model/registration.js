const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const employSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }]
})
console.log(process.env.SECRET_KEY)

employSchema.pre("save",async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
        this.confirmPassword = await bcrypt.hash(this.password,10)
        next()
    }
})
employSchema.methods.generateToken = async function() {
     try{
         const token = jwt.sign({_id: this._id.toString()},process.env.SECRET_KEY)
         this.tokens = this.tokens.concat({token})
         await this.save()
         return token
     }
     catch(e){
        res.end(e)
        console.log(e)
     }
}

const EmployersData = new mongoose.model("EmployersData",employSchema)
module.exports = EmployersData