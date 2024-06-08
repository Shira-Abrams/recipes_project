
const express=require('express')
const morgan = require('morgan');
const cors=require('cors');
 const userRouter=require('./routes/user.route')
 const recipesRouter=require('./routes/recipe.route')
 const categoriesRouter=require('./routes/categories.route')

const {pageNotFound,serverErrors}= require('./middlewares/handleErrors')
require('dotenv').config();
require('./config/db')

const app=express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'))
app.use(cors());
app.use('/images', express.static('images'));
app.use('/users',userRouter);
app.use('/recipes',recipesRouter);
app.use('/categories',categoriesRouter)
app.use(pageNotFound);
app.use(serverErrors);
const port=process.env.PORT;
app.listen(port ,()=>{
    console.log("running at http://localhost:" + port);

})