const express= require('express');
const {getAllCategories,
       getAllCategoriesAndRecipe,
       getCategoryByIdWithRec}=require('../controllers/categories.controller');
const { setDriver } = require('mongoose');

const router=express.Router();


router.get('/getallcategories',getAllCategories);
router.get('/getAllCategoriesAndRecipe',getAllCategoriesAndRecipe);
router.get('/getCategoryByIdWithRec/:id',getCategoryByIdWithRec)
module.exports=router
