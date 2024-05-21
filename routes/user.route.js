const express= require('express');
const {signIn,signUp,getAllUser}=require('../controllers/user.controller')
const {auth}=require('../middlewares/auth')
const router =express.Router();
//הרשמה
router.post('/signup',signUp);
//התחברות
router.post('/signin',signIn);
router.get('/getAllUser',getAllUser);
module.exports=router;
