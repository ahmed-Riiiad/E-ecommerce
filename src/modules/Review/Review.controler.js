import { ReviewModel } from "../../../database/models/Review.model.js"
import { generateError } from "../../utiles/generateError.js"
import { ApiFeature } from "../../utiles/apiFeatures.js"
import { catchError } from "../../utiles/catchError.js"

const createReview=catchError (async(req,res,next)=>{
  req.body.user = req.user._id
  let isReviewBefore =await ReviewModel.findOne({user:req.user._id,product:req.body.product})
  if(isReviewBefore) return next(new generateError('already review before',409))
  let result =  new ReviewModel(req.body)
  await result.save()
  res.json({ msg : 'success', result })
})

const getAllReview=catchError (async(req,res,next)=>{

  let apiFeature = new ApiFeature(ReviewModel.find(),req.query).paginate()
  .selectFields().filterByKeyword().sortBy()
  // execute
    let result = await apiFeature.mongooseQuery
    res.json({msg : 'success',page : apiFeature.page ,result})
})


const getOneReview =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await ReviewModel.findById(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  const UpdateReview =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await ReviewModel.findOneAndUpdate({user:req.user._id,_id:id}, req.body,{new:true})
    !result && next(new generateError('U are not authorize to update this review',404))
    result && res.json({msg : 'success',result})
  })

  const deleteReview =catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await ReviewModel.findByIdAndDelete(id)
    !result && next(new generateError('not found',404))
    result && res.json({msg : 'success',result})
  })

  export{
    createReview,getAllReview,getOneReview,UpdateReview,deleteReview
  }