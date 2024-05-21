const express=require('express');
const {getAllRecipes,
    getRecipeByCode,
    getRecipesByPreperationTime,
    getRecipesByUser,
    addRecipe,
    updateRecipes,
    deleteRecipe}= require('../controllers/recipe.controller');
const { auth } = require('../middlewares/auth');
const router=express.Router();
router.get('/getallrecipes',getAllRecipes);
router.get('/getRecipeByCode/:id',getRecipeByCode);
router.get('/getRecipesByPreperationTime/:preperationTime',getRecipesByPreperationTime);
router.get('/getRecipesByUser/:userId',getRecipesByUser);
router.post('/addRecipe',auth,addRecipe);
router.put('/updateRecipes/:id',auth,updateRecipes);
router.delete('/deleteRecipe/:id',auth,deleteRecipe);
module.exports=router;
