const { Recipes } = require("../models/recipe.model")
const {Categories}=require("../models/categories.model");
const { default: mongoose } = require("mongoose");
//#
exports.getAllRecipes=async(req,res,next)=>{

    // optional parameters - לא חובה
    // http://localhost:5000/courses?search=ab&page=1&perPage=3
    let {search,page,perPage}=req.query;
    search ??=''
    page ??=1
    perPage ??=3
    try {
        
      const AllRecipes= await Recipes.find({name:new RegExp(search)})
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
    //לבדוק הראשות גישה למשתמש 
    const id=req.params.userId;
    try {
        const userRecipe= await Recipes.find({'user._id':id}).select('-__v') ;
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
    
    try {
        if(req.user.role=='admin'||req.user.role=="registered user"||req.user.role=="user")
         {
             const recipe=new Recipes(req.body)
             recipe.save();
             const {categories}=req.body;
             categories.forEach(async element => {
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
                       ImageUrl:recipe.ImageUrl,
                       _id:recipe.id
                     }
                 }) 
               await  mewCategory.save();
             }
                
              }); 

              res.json(recipe).status(201);//created json
        }
         else{
            next({message:' only admin or registered user can add recepie ' ,status:403})
         }
        
    } catch (error) {
        next({message:error.message})
    }
}
//##
exports.updateRecipes=async(req,res,next)=>{
    //האם צריך לעדכן קטוגריה ??      
      const id= req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id))
        next({message:'id is not valid'})
   try {
    if(req.user.role=='admin'||req.user.role=='registered user'||req.user.role=='user'){
        const updatedUser= await Recipes.findByIdAndUpdate(
            id,
            { $set: req.body },
            {new:true}
       );
       return res.json(updatedUser)
    }
    else{
        next({message:' only admin or registered user can add recepie ' ,status:403})

    }
   } catch (error) {
      next({message:error.message})
   }
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
            categories.forEach(async element => {
            const cat= await Categories.findOne({description:element });
            console.log('cat= ', cat);
            console.log("cat.recipes",cat.recipes);
                if(cat.recipes.length==1)
                {
                    await Categories.findByIdAndDelete(cat._id)
                }
                    
            });


            await  Recipes.findByIdAndDelete(id)
            return res.status(204).send();
        }
    } catch (error) {
        next({message:error.message})
    }
}

