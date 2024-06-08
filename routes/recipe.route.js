const express=require('express');
const {getAllRecipes,
    getRecipeByCode,
    getRecipesByPreperationTime,
    getRecipesByUser,
    addRecipe,
    updateRecipes,
    deleteRecipe}= require('../controllers/recipe.controller');
const { userAuth } = require('../middlewares/userAuth');
const { adminAuth } = require('../middlewares/adminAuth');

const router=express.Router();
router.get('/getallrecipes',getAllRecipes);
router.get('/getRecipeByCode/:id',getRecipeByCode);
router.get('/getRecipesByPreperationTime/:preperationTime',getRecipesByPreperationTime);
router.get('/getRecipesByUser/:userId',getRecipesByUser);
router.post('/addRecipe',userAuth,addRecipe);
router.put('/updateRecipes/:id',userAuth,updateRecipes);
router.delete('/deleteRecipe/:id',userAuth,deleteRecipe);
module.exports=router;
