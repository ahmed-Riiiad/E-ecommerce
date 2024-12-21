import { userModel } from "../../../database/models/user.model.js";
import { catchError } from "../../utiles/catchError.js";
import { generateError } from "../../utiles/generateError.js";
import { getAll, getOne,deleteOne } from "../../utiles/handlerFactory.js";


const filterObjMe = (obj , ...allowedFiles) =>{
  const newObj = {}
  Object.keys(obj).forEach(element => {
    if(allowedFiles.includes(element)) newObj[element] = obj[element]
  });
  return newObj
}
const filterObjUser = (obj , ...allowedFiles) =>{
  const newObj = {}
  Object.keys(obj).forEach(element => {
    if(allowedFiles.includes(element)) newObj[element] = obj[element]
  });
  return newObj
}

const createUser =catchError (async(req,res)=>{
  let user = await userModel.findOne({email : req.body.email})
  if(user){
    return next(new generateError("account already exist",409))}
  let result =  new userModel(req.body)
  await result.save()
  res.json({Status : 'success',result})  
})
const GetMe =catchError (async(req,res,next)=>{
  req.params.id = req.user.id 
  next()
  })

  const UpdateME = catchError(async (req, res, next) => {
    const { id } = req.params;
  
    // 1. Prevent password updates in this route
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new generateError('This route is not for password updates. Please use /updateMyPassword', 400)
      );
    }
  
    // 2. Filter out unwanted fields that are not allowed to be updated
    const filterReqBody = filterObjMe(req.body, 'name', 'email');
  
    // 3. Check for file upload and add photo to the filtered body if exists
    if (req.file) {
      filterReqBody.photo = req.file.filename;  // Safe access to req.file.filename
    } else {
      console.log('No file uploaded');
    }
  
    // Debug: Output the filtered request body and file name (if any)
    console.log(req.file ? req.file.filename : 'No file uploaded', filterReqBody);
  
    // 4. Update the user document
    let result = await userModel.findByIdAndUpdate(id, filterReqBody, { new: true });
  
    if (!result) {
      return next(new generateError('User not found', 404));
    }
  
    // 5. Return success response with updated user details
    return res.json({ status: 'success', result });
  });
  

const UnActiveMe = catchError(async(req,res,next)=>{
  const {id}= req.params 
    let result =await userModel.findByIdAndUpdate(id,{active : false} )
    res.status(204).json({Status : 'success', result  })
  })
const UpdateUser =catchError (async(req,res,next)=>{
  
  // 1- create err if posted password 
  if (req.body.password){
    return next(new generateError('not authorized to change pass here',400))
  } 
    // 2- filter out unwanted filed like change role 
    const filterReqBody = filterObjUser(req.body,'name','email', 'role')
    // 3- update user doc 
    let result =await userModel.findByIdAndUpdate(req.user.id, filterReqBody ,{new:true})
    !result && next(new generateError('not found',404))
    result && res.json({Status : 'success',result})
  })
  
 
  
  const getAllUser =getAll(userModel)
  const deleteUser = deleteOne(userModel)
  const getOneUser =getOne(userModel)

  const changeUserPass = catchError(async (req, res, next) => {
    const { id } = req.params;
    const { password, passwordConfirm } = req.body;
    if (password !== passwordConfirm) {
        return next(new generateError('Passwords do not match', 400)); 
    }
    req.body.passwordChangeAT = Date.now();
    const result = await userModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
        return next(new generateError('User not found', 404)); 
    }
    return res.json({ Status: 'success', result });
});

  export{
    createUser,getAllUser,getOneUser,UpdateUser,deleteUser,UnActiveMe,UpdateME
    ,GetMe,changeUserPass
  }

// const filterObj = (obj , ...allowedFiles) =>{
//   const newObj = {}
//   Object.keys(obj).forEach(element => {
//     if(allowedFiles.includes(element)) newObj[element] = obj[element]
//   });
//   return newObj
// }

// const createUser =catchError (async(req,res)=>{
//   let user = await userModel.findOne({email : req.body.email})
//   if(user){
//     return next(new generateError("account already exist",409))}
//   let result =  new userModel(req.body)
//   await result.save()
//   res.json({Status : 'success',result})  
// })
// const GetMe =catchError (async(req,res,next)=>{
//   req.params.id = req.user.id 
//   next()
//   })
// const getAllUser =catchError (async(req,res,next)=>{

//   let apiFeature = new ApiFeature(userModel.find(),req.query).paginate()
//   .selectFields().filterByKeyword().sortBy()
//   // execute
//     let result = await apiFeature.mongooseQuery
//     res.json({Status : 'success',page : apiFeature.page ,result})
// })


// const getOneUser =catchError (async(req,res,next)=>{
//     const {id}= req.params 
//     let result =await userModel.findById(id)
//     !result && next(new generateError('not found',404))
//     result && res.json({Status : 'success',result})
//   })

//   const UpdateUser =catchError (async(req,res,next)=>{
//     // 1- create err if posted password 
//     if (req.body.password){
//       return next(new generateError('not authorized to change pass here',400))
//     } 
//     // 2- filter out unwanted filed like change role 
//     const filterReqBody = filterObj(req.body,'name','email')
//     // 3- update user doc 
//     let result =await userModel.findByIdAndUpdate(req.user.id, filterReqBody ,{new:true})
//     !result && next(new generateError('not found',404))
//     result && res.json({Status : 'success',result})
//   })

//   const changePass =catchError (async(req,res,next)=>{
//     const {id}= req.params 
//     req.body.passwordChangeAT = Date.now()
//     let result =await userModel.findByIdAndUpdate(id,req.body,{new:true})
//     !result && next(new generateError('not found',404))
//     result && res.json({Status : 'success',result})
//   })

//   const deleteUser = deleteOne(userModel)

//   const UnActiveUser = catchError(async(req,res,next)=>{
//     let result =await userModel.findByIdAndUpdate(req.user.id,{active : false} )
//     res.Status(204).json({Status : 'success', result : null })
//   })

//   export{
//     createUser,getAllUser,getOneUser,UpdateUser,deleteUser,changePass,UnActiveUser, GetMe
//   }