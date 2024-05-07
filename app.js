
//mongodb+srv://sh3000444:27WaemCrR7MHnatW@cluster0.bfaxly7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb+srv://sh3000444:<password>@cluster0.bfaxly7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0



const express=require('express')
const morgan = require('morgan');
const cors=require('cors')

require('dotenv').config();
require('./config/db')

const app=express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'))
app.use(cors())


const port=process.env.PORT;
app.listen(port ,()=>{
    console.log("running at http://localhost:" + port);

})