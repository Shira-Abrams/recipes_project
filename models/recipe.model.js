const mongoose = require('mongoose');
const Joi = require('joi');
const {userSchema}= require('./user.model')

// const categoryMiniSchema=new mongoose.Schema({
//    names:{type:String},

// })
// const layerSchema=new mongoose.Schema=({
//     description:{type:String},
//     ingredients:[{type:String}]

// })
//שכבות 
// קטגוריות
//סכמות
const miniUser= new mongoose.Schema({
      name:{type:String,require:true,get(v) {return v.toUpperCase}},
    _id:{type:mongoose.Types.ObjectId,required:true,ref:'users'}
})
const recipeSchema=new mongoose.Schema({
    name:{type:String},

    description:{type:String},
    categories:[{type:String,required:true}],
    preperationTime:{type:Number},
    difficulty:{type:Number,min:1,max:5},
    dateAdded:{type:Date, default:new Date()},
    layersArray:[{
        description:{type:String},
        ingredients:[{type:String}]
    }],
    preperationInstruction:{type:String},
    imagUrl:{type:String},
    isPrivate:{type:Boolean},
    user:miniUser
})

module.exports.Recipes=mongoose.model('recipes', recipeSchema)
