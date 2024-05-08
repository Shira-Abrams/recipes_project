const mongoose = require('mongoose');
const {} =require('./recipe.model')
const  categoriesSchema= new mongoose.Schema({
    code:{type:Number},
    description:{type:String},
    recipes:[{type:mongoose.Types.ObjectId,ref:'user'}]
})

moudule.exports.Categories.model('categories',categoriesSchema)