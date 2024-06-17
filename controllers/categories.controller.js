const mongoose=require('mongoose')
const {Categories}=require("../models/categories.model");
const {Recipes}=require("../models/recipe.model");

//בלי הראשות גישה 

exports.getAllCategories=async(req,res,next)=>{
   try {
    const categories=await Categories.find().select('-__v')
    return res.send(categories)
   } catch (error) {
    next({message:error.message})
   }
}

exports.getAllCategoriesAndRecipe=async(req,res,next)=>{
      try {
       const categoriesAndRecipe=await Categories.find().populate('recipes._id').select('-__v')
   
        return res.send(categoriesAndRecipe)
      } catch (error) {
         next({message:error.message})
      }
}

exports.getCategoryByIdWithRec=async(req,res,next)=>{
    const id=req.params.id;
try {
    const recipesByCategorie =await Categories.findById(id).select('-__v');
    res.send(recipesByCategorie);
} catch (error) {
    next({message:error.message});
}
}
