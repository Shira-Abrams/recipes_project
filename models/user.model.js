const bcrypt=require('bcrypt');
const Joi = require('joi');
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');



const userSchema=new mongoose.Schema(
    {
        username:{type:String,required:true},
        password:{type:String,uniqe:true,minlength:[8,'password must contain at least 3 '],match:/(?=.*[a-zA-Z])(?=.*\d)/},
        email:{type:String,uniqe:true},
        addres:{type:String},
        role:{type:String,default:'user', enum:['admin','user']}
    }
)
//hashing the password before saving in the db
userSchema.pre('save',function(next){
   const salt=process.env.BCRYPT_SALT
   bcrypt.hash(this.password,salt,async(err,hashPassword)=>{
    if(err)
        throw new Error(err.message)
    this.password=hashPassword;
    next()//??
   })
})

//validation schema
module.exports.userValidator={
    logInSchema:Joi.object({
        email:Joi.string().email({min:2,tlds:{allow:['come','net']}}),
        password:Joi.string().min(8).max(16).required(),
    })

}
//generatin the token 
moudule.exports.generateToken=(user)=>{
    const privateKey=process.env.JWT_SECRET||'JWT_SECRET'//sercret string theat the token generated according to it
    const data={role:user.role,user_id:user.user_id} // the relvent details for the user authantication
    const token=jwt.sign(data,privateKey,{expiresIn:'1h'})//generate the token plus  expiry date
    return token;
}
   

  
module.exports.userSchema=userSchema
module.exports.User=mongoose.model('user',userSchema)