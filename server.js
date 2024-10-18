require("dotenv").config();


const config =require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User =require ("./models/user.model");

const express = require("express");
const app = express();

const jwt =require("jsonwebtoken")
const {authenticateToken} =require("./utilities");


app.use(express.json());


app.get("/", (req, res) => {
  res.json({ data: "hlo" });
});

app.post("/create-account",async(req,res)=>{
  const{fullName,email,password}=req.body;

  if(!fullName) {
    return res 
      .status(400)
      .json({error:true,message:"Full name required"});
  }
  if(!email) {
    return res.status(400).json({error:true,message:"Email is required"});
  }
  if(!password) {
    return res.status(400).json({error:true,message:"Password is required"})
  }
  const isUser = await User.findOne({email:email});
  if(isUser) {
    return res.json({
      error:true,
      message: "User already exist",
    });
  }
  const user =new User({
    fullName,
    email,
    password,
  });
  await user.save();
  const accessToken =jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:"30m",

  });
  return res.json({
    error:false,
    user,
    accessToken,
    message:"Registration Successful",
  });
});

app.listen(8001, () => {
  console.log("Server is running on port 8001");
});

module.exports = app;
