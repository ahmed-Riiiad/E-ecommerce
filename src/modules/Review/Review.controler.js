import { catchError } from "../../utiles/catchError.js";
import { generateError } from "../../utiles/generateError.js";
import { UpdateModel, deleteOne, getAll, getOne } from "../../utiles/handlerFactory.js";
import { ReviewModel } from "../../../database/models/Review.model.js"


const createReview = catchError(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;

  // Check if a review already exists for the same user and tour
  let existingReview = await ReviewModel.findOne({
    user: req.user.id,
    product: req.body.product
  });

  if (existingReview) {
    return next(new generateError('You have already reviewed this product.', 409));
  }

  // Create and save the new review
  let result = new ReviewModel(req.body);
  await result.save();

  // Populate the 'user' and 'tour' fields after saving the review
  result = await result.populate([
    { path: 'user', select: 'name' },
    { path: 'product', select: 'name' }
  ]);

  res.json({ msg: 'success', result });
});


const UpdateReview =UpdateModel(ReviewModel)
const getAllReview= getAll(ReviewModel)
const getOneReview =getOne(ReviewModel)
const deleteReview =deleteOne(ReviewModel)



  export{
    createReview,getAllReview,getOneReview,UpdateReview,deleteReview
  } 