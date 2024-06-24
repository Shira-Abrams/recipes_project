const { Recipes } = require("../models/recipe.model")
const {Categories}=require("../models/categories.model");
const { default: mongoose } = require("mongoose");
const multer = require('multer');
const path = require('path');
const { error } = require("console");
const { query } = require("express");
//#
exports.getAllRecipes=async(req,res,next)=>{

    // optional parameters - לא חובה
    // http://localhost:5000/courses?search=ab&page=1&perPage=3
    let {search,page,perPage}=req.query;
    search ??=''
    page ??=1
    perPage ??=3
    try {
        
      const AllRecipes= await Recipes.find({name:new RegExp(search),isPrivate:false})
      .skip((page-1)*perPage)
      .limit(perPage)
      .select('-__v');
      return res.send(AllRecipes);
    } catch (error) {
       next(error) 
    }

}


//#
exports.getRecipeByCode=async(req,res,next)=>{
    const  id =req.params.id;
     console.log('id==',id);
    if(mongoose.Types.ObjectId.isValid(id)){
        try {
            const recipeById=await Recipes.findById(id,{__v:false})
            res.json(recipeById).status(200);
        } catch (error) {
            next({message:error.message})
        }
        
    }
    else{
        next({message:'id is not valid ', status:404})
    }
};


exports.getRecipesByUser=async(req,res,next)=>{
    let {search}=req.query;
    search ??=''

    //לבדוק הראשות שה למשתמש 
    const id=req.params.userId;
    try {
        const userRecipe= await Recipes.find({ 'user._id':id}).select('-__v');
        console.log('id=' ,id,'user==' ,userRecipe);
        return res.json(userRecipe).status(200);
    } catch (error) {
        next({message:error.message,status:404})
    }
    //האם צריך הרשאות לפי טוקן ?
    
}

exports.getRecipesByPreperationTime=async(req,res,next)=>{
  const {preperationTime}= req.params;  
  console.log("preperationTime==",preperationTime);
  try {
     const recipeByPreaperationTime=await Recipes.find({preperationTime:preperationTime}).select('-__v')
     return res.json(recipeByPreaperationTime).status(201);
  } catch (error) {
    next({message:error.message,status:404})
  }
}


exports.addRecipe=async(req,res,next)=>{
    console.log('Request Body:', req.body);

    upload(req,res,async(err)=>{
        
        if (err) {
            if (err instanceof multer.MulterError) {
              // A Multer error occurred when uploading.
              console.log('req file',req.file);
               console.log(req.body);
              return res.status(400).json({ message: err });
            } else {
              // An unknown error occurred when uploading.
              return res.status(500).json({ message: err });
            }
        }
        console.log('Request Body:', req.body);
        console.log('Request File:', req.file);

        try {
            if(req.user.role=='admin'||req.user.role=="user")
            {   
                if (req.file) {
                    console.log(req.file);
                    req.body.imagUrl=req.file.filename;
                }
                 
                 const recipe=new Recipes(req.body);
                 recipe.save();
                 const {categories}=req.body;
                 if(categories)
                 {   for(const element of categories){
                        console.log('element =',element);
                          const cat= await Categories.findOne({description:element});
                          console.log('cat=',cat);
                          if(cat){
                              cat.recipes.push(recipe);
                              await cat.save();
                          }
                          else{
                            
                              const mewCategory= new Categories({
                                  description:element,
                                  recipes:{
                                    name:recipe.name,
                                    imagUrl:recipe.imagUrl,
                                    difficulty:recipe.difficulty,
                                    preperationTime:recipe.preperationTime,
                                    _id:recipe.id
                                  }
                              }) 
                             await  mewCategory.save();
                          }
                     }
                
                 }
                 
    
                  res.json(recipe).status(201);//created json
            }
             else{
                next({message:' only admin or registered user can add recepie ' ,status:403})
             }
            
        } catch (error) {
            next({message:error.message})
        }
       
    })

    
    
}
//##
exports.updateRecipes=async(req,res,next)=>{
    upload(req,res,async(error)=>{
        if (error) {
            if (err instanceof multer.MulterError) {
              // A Multer error occurred when uploading.
               console.log('req file',req.file);
               console.log(req.body);
              return res.status(400).json({ message: err });
            } else {
              // An unknown error occurred when uploading.
              return res.status(500).json({ message: err });
            }
        }


        const id= req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id))
            next({message:'id is not valid'})
       try {
        if(req.user.role=='admin'||req.user.role=='user'){
           
         const  prevRecipe=await Recipes.findById(id)
           if(!prevRecipe)
             return next({message:'recipe not found'})
            if(req.file)
            {
                console.log(req.file);
                req.body.imagUrl=req.file.filename
            }
           
            const updatedRecipe= await Recipes.findByIdAndUpdate(
            id,
            { $set: req.body },
            {new:true});
       
           const {categories}=req.body;
           const prevCategory=prevRecipe.categories
           for(let category of prevCategory){
            
            if(!categories.includes(category))
            {
               const cat= await Categories.findOne({description:category});
                if(cat)
                {  
    
                    if(cat.recipes.length==1)
                     {
                         await Categories.findByIdAndDelete(cat._id)
                     }
                     else{
                         cat.recipes=cat.recipes.filter(x=>x.id!=id)
                         await cat.save()
                     }
                   
                }
                
            }
           }
           for(let element  of categories)
            {       
                    const cat= await Categories.findOne({description:element});
                    if(!cat)
                    {
                        const mewCategory= new Categories({
                            description:element,
                            recipes:{
                              name:updatedRecipe.name,
                              imagUrl:updatedRecipe.imagUrl,
                              difficulty:updatedRecipe.difficulty,
                              preperationTime:updatedRecipe.preperationTime,
                              _id:updatedRecipe.id
                            }
                        }) 
                       await  mewCategory.save();
                    }
                    if(cat)
                    {
                      let RecipeIndex= cat.recipes.findIndex(x=>x._id==prevRecipe._id) 
                       console.log('RecipeIndex',RecipeIndex);
                      cat.recipes[RecipeIndex]={
                              name:updatedRecipe.name,
                              imagUrl:updatedRecipe.imagUrl,
                              difficulty:updatedRecipe.difficulty,
                              preperationTime:updatedRecipe.preperationTime,
                              _id:updatedRecipe.id
                      }
                      await  cat.save();
                    }
            }
    
           
           return res.json(updatedRecipe)
        }
        else{
            next({message:' only admin or registered user can add recepie ' ,status:403})
    
        }
       } catch (error) {
          console.log(error);
          next({message:error.message})
       }
        
    })
    
}


exports.deleteRecipe=async(req,res,next)=>{ 
    const id=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id))
        next({message:' id is not valid'})
    try {
        if(req.user.role=='admin'||req.user.role=='registered user'||req.user.role=='user')
        {   
            const rec=await Recipes.findById(id)
            if(!rec)
                return next({message:'recipe not found'})
            
            const categories =rec.categories;
            for(element of categories)
                { 
                    
                    const cat= await Categories.findOne({description:element });
                    if(cat)
                  {
                       console.log('cat= ', cat);
                       console.log("cat.recipes",cat.recipes);
                       if(cat.recipes.length==1)
                        {
                            await Categories.findByIdAndDelete(cat._id)
                        }
                        else{
                            cat.recipes.filter(x=>x._id!=rec._id)
                           await cat.save();
                        }

                  }
                   
                        
                            
                } 
            
            await  Recipes.findByIdAndDelete(id)
            return res.status(204).send();
        }
    } catch (error) {
        next({message:error.message})
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../recipes_project/images'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + ".jpg");
    }
  });
 const upload = multer({
   storage: storage,
   fileFilter: (req, file, cb) => {
     const filetypes = /jpeg|jpg|png|gif/;
     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
     const mimetype = filetypes.test(file.mimetype);
 
     if (mimetype && extname) {
       return cb(null, true);
     } else {
       cb('Error: Images only!');
     }
   }
 }).single('image');  