import { catchError } from "../../utiles/catchError.js"
import  {ProductModel} from "../../../database/models/Products.model.js"
import slugify from "slugify"
import {  deleteOne, getAll, getOne } from "../../utiles/handlerFactory.js"


const createProduct = catchError(async (req, res) => {
  if (!req.body.Title || typeof req.body.Title !== 'string') {
      return res.status(400).json({ msg: "Title is required and must be a string" });
  }
  req.body.slug = slugify(req.body.Title, { lower: true });
  if (!req.files || !req.files.imgCover) {
      return res.status(400).json({ msg: "Please upload the main image (imgCover)" });
  }
  req.body.imgCover = req.files.imgCover[0].filename;
  if (!req.files.imgs) {
      return res.status(400).json({ msg: "Please upload images (imgs)" });
  }
  req.body.imgs = req.files.imgs.map(file => file.filename);
  const newProduct = new ProductModel(req.body);
  await newProduct.save();

  const populatedProduct = await ProductModel.findById(newProduct._id)
    .populate({
      path: 'category',   
      select: 'name', 
  }) 
  .populate({
    path: 'SubCategory',   
    select: 'name', 
})
    .populate({
      path: 'Brand',   
      select: 'name', 
  }); 

  // Return the created and populated product as a response
  res.status(201).json({
      msg: 'Product created successfully',
      product: populatedProduct
  });
});
;




const UpdateProduct =catchError (async(req,res,next)=>{
  const {id}= req.params 
  if (req.body.Title) req.body.slug = slugify(req.body.Title)
  let result =await ProductModel.findByIdAndUpdate(id,req.body,{new:true})
!result && next(new generateError('doc not found', 404 ))
result && res.json({msg : 'success',result})
})

const getAllProduct =getAll(ProductModel)
const getOneProduct =getOne(ProductModel)
const deleteProduct =deleteOne(ProductModel)

  export{
    createProduct,getAllProduct,getOneProduct,UpdateProduct,deleteProduct
  }