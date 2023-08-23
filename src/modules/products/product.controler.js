import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import  {ProductModel} from "../../../database/models/Products.model.js"
import slugify from "slugify"
import { ApiFeature } from "../../utiles/apiFeatures.js"

const createProduct =catchError (async(req,res)=>{
    req.body.slug = slugify(req.body.name)
    req.body.imgCover = req.files.imgCover[0].filename
    req.body.imgs = req.files.imgs.map(obj=>obj.filename)
  let mongooseQuery =  new ProductModel(req.body)
  await  mongooseQuery.save()
  res.json({msg : 'success',mongooseQuery})
})

const getAllProduct =catchError (async(req,res,next)=>{

let apiFeature = new ApiFeature(ProductModel.find(),req.query).paginate()
.selectFields().filterByKeyword().sortBy()
// execute
  let result = await apiFeature.mongooseQuery
  res.json({msg : 'success',page : apiFeature.page ,result})
})


const getOneProduct =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await ProductModel.findById(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  const UpdateProduct =catchError (async(req,res,next)=>{
    const {id}= req.params 
    const {name} = req.body
    let result =await ProductModel.findByIdAndUpdate(id,{ name,slug: slugify(name)},{new:true})
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  const deleteProduct =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await ProductModel.findByIdAndDelete(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  export{
    createProduct,getAllProduct,getOneProduct,UpdateProduct,deleteProduct
  }