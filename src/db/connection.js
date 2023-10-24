const mongoose = require("mongoose")

const main = async() =>{
    try{
      await mongoose.connect('mongodb://127.0.0.1:27017/register');
      console.log("success")
    }
    catch(error){
      console.log(error,'This is the error')
    }
  }
  main()

