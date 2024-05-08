const Joi = require('joi');
const mongoose = require('mongoose');
const {userSchema}= require('./user.model')
const recipeSchema=new mongoose.mongoose.Schema({
    name:{type:String},
    description:{type:String},
    categories:[],
    preperationTime:{type:Number},
    difficulty:{type:Number,match:[1-5]},
    dateAdded:{type:Date, default:new Date()},
    layersArray:{},
    preperationInstruction:{type:String},
    imagUrl:{type:String},
    isPrivate:{type:Boolean}
})

moudule,exports.Recipes=mongoose.model('recipes', recipeSchema)
