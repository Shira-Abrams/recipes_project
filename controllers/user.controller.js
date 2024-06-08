const bcrypt=require('bcrypt');
const Joi=require('joi');
const {User,generateToken, userValidator}=require('../models/user.model')
//new user singUp -הרשמה 
exports.signUp=async(req,res,next)=>{
   const {username,email,password,role,addres}=req.body;
   try {
    const user=new User({username,email,password,role,addres})
    await user.save();
    const token=generateToken(user);
    user.password='****'
    return res.status(201).json({user,token})


   } catch (error) {
    next({message:error.message,status:409})
   }
}
// התחברות 
exports.signIn=async(req,res,next)=>{
   const valid= userValidator.logInSchema.validate(req.body) 
  if (valid.error)
    return next({message:valid.error.message});

    const {password,email}=req.body;
    const user = await User.findOne({email})
    console.log(email,password);
    console.log('user=', user);
    if(user){
      bcrypt.compare(password,user.password,(err,same)=>{
         if(err){
             return next(new Error(err.message))
         }
         if(same){
             const token=generateToken(user)
             user.password='****'
             return res.send({user,token})
         }
         //החזרת תשובה כללית מטעמי אבטחה
         return next({message:'Auth Failed  (details are not correct)', status:401})
      })
      
    }
    else{
     // user doese not exist 
     return next({message:'Auth Failed ( user doese not exist )', status:401})
  }
   
   
}

exports.getAllUser=async(req,res,next)=>{
     
    try {
        const user=await User.find().select('-__v');
        user.forEach(element => {
            element.password='****'
        });
        console.log('user==',user);
        return res.json(user);
    } catch (error) {
        //console.log(user);
        next({message:error.message,status:401})
    }
   
}




