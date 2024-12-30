const Recipes=require("../models/recipe")
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + '-' + file.fieldname
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })

const getRecipes=async(req,res)=>{
    const recipes=await Recipes.find()
    return res.json(recipes)
}

const getRecipe=async(req,res)=>{
    const recipe=await Recipes.findById(req.params.id)
    res.json(recipe)
}

const addRecipe=async(req,res)=>{
    console.log(req.user)
    const {title,ingredients,instructions,time}=req.body 

    if(!title || !ingredients || !instructions)
    {
        res.json({message:"Required fields can't be empty"})
    }

    const newRecipe=await Recipes.create({
        title,ingredients,instructions,time,coverImage:req.file.filename,
        createdBy:req.user.id
    })
   return res.json(newRecipe)
}

const editRecipe=async(req,res)=>{
    const {title,ingredients,instructions,time}=req.body 
    let recipe=await Recipes.findById(req.params.id)

    try{
        if(recipe){
            let coverImage=req.file?.filename ? req.file?.filename : recipe.coverImage
            await Recipes.findByIdAndUpdate(req.params.id,{...req.body,coverImage},{new:true})
            res.json({title,ingredients,instructions,time})
        }
    }
    catch(err){
        return res.status(404).json({message:err})
    }
    
}
    const deleteRecipe = async (req, res) => {
        try {
            const recipeId = req.params.id;
            console.log('Received recipe ID:', recipeId);  // Log the ID
    
            const recipe = await Recipes.findById(recipeId);
            if (!recipe) {
                console.log('Recipe not found for ID:', recipeId);  // Log if recipe is not found
                return res.status(404).json({ message: 'Recipe not found' });
            }
    
            await Recipes.deleteOne({ _id: recipeId });
            console.log('Recipe deleted successfully');
            return res.json({ status: 'ok', message: 'Recipe deleted successfully' });
        } catch (err) {
            console.error('Error during deletion:', err);
            return res.status(500).json({ message: 'Failed to delete recipe' });
        }
    };



module.exports={getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe,upload}