import { SubCategoryModel } from "../../../database/models/SubCategory.model.js"
import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import slugify from "slugify"
import { deleteOne, getOne } from "../../utiles/handlerFactory.js"

const createSubCategory = catchError(async (req, res) => {
  const { name, category } = req.body;  // Make sure the field name is 'category'
  if (!category) {
    return res.status(404).json({ msg: 'Category not found' });
  }
  
  // Create a new SubCategory instance
  let result = new SubCategoryModel({
    name,
    Category: category,  
    slug: slugify(name),
  });

  // Save the subcategory to the database
  await result.save();

  // Check if the category exists and then populate it
  const populatedResult = await result.populate({
    path: 'Category',   
    select: 'name',     
  });

  // Return the populated result
  res.json({ msg: 'success', result: populatedResult });
});


const getAllSubCategory = catchError(async (req, res, next) => {
  const { categoryId } = req.params;  
  let filter = {};
  
  if (categoryId) {
      filter = { Category: categoryId };  
  }
  console.log('Category ID:', req.params.categoryId);  
  console.log('Filter:', filter);  

  const result = await SubCategoryModel.find(filter).populate({
      path: 'Category',   
      select: 'name -_id', 
  });

  res.json({ msg: 'success', result });
});




const UpdateSubCategory =catchError (async(req,res,next)=>{
  const {id}= req.params 
  const {name,category} = req.body
  let result =await SubCategoryModel.findByIdAndUpdate(id,{ name,category,slug: slugify(name)},{new:true})
  !result && next(new generateError('not found',404))
  result && res.json({msg : 'success',result})
})

const getOneSubCategory =getOne(SubCategoryModel)
const deleteSubCategory =deleteOne(SubCategoryModel)
export {
  createSubCategory,getAllSubCategory,getOneSubCategory,UpdateSubCategory,deleteSubCategory
  }