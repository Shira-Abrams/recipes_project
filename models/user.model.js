const bcrypt=require('bcrypt');
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');



const userSchema=new mongoose.Schema(
    {
        username:{type:String,required:true},
        password:{type:String,unique:true,minlength:[8,'password must contain at least 8'],match:/(?=.*[a-zA-Z])(?=.*\d)/,required:true},
        email:{type:String,unique:true},
        addres:{type:String},
        role:{type:String,default:'user', enum:['admin','user','registered user']}
        
    }
)
//hashing the password before saving in the db
userSchema.pre('save',function(next){
   const salt=+process.env.BCRYPT_SALT|10
   bcrypt.hash(this.password,10,async(err,hashPassword)=>{
    if(err)
        throw new Error(err.message)
    this.password=hashPassword;
    next()//??
   })
})

//validation schema
module.exports.userValidator={
    logInSchema:Joi.object({
         email:Joi.string().email().required(),
         password:Joi.string().min(8).required(),
    })

}

//generatin the token 
//
module.exports.generateToken=(user)=>{
    const privateKey=process.env.JWT_SECRET||'JWT_SECRET'//sercret string theat the token generated according to it
    const data={role:user.role,user_id:user.user_id} // the relvent details for the user authantication
    const token=jwt.sign(data,privateKey,{expiresIn:'1h'})//generate the token plus  expiry date
    return token;
}
   

  
module.exports.userSchema=userSchema
module.exports.User=mongoose.model('user',userSchema)