import { ReviewModel } from "../../../database/models/Review.model.js"
import { generateError } from "../../utiles/generateError.js"
import { catchError } from "../../utiles/catchError.js"
import { UpdateModel, getAll, getOne , deleteOne} from "../../utiles/handlerFactory.js"

const createReview=catchError (async(req,res,next)=>{
  req.body.user = req.user._id
  let isReviewBefore =await ReviewModel.findOne({user:req.user._id,product:req.body.product})
  if(isReviewBefore) return next(new generateError('already review before',409))
  let result =  new ReviewModel(req.body)
  await result.save()
  res.json({ msg : 'success', result })
})

const UpdateReview =UpdateModel(ReviewModel)
const getAllReview=getAll(ReviewModel)
const getOneReview =getOne(ReviewModel)
const deleteReview =deleteOne(ReviewModel)
  export{
    createReview,getAllReview,getOneReview,UpdateReview,deleteReview
  }