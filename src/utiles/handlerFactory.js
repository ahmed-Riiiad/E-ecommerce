import { ApiFeature } from "./apiFeatures.js"
import { catchError } from "./catchError.js"
import { generateError } from "./generateError.js"


export const deleteOne = model => catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await model.findByIdAndDelete(id)
    !result && next(new generateError('doc not found',404))
    result && res.json({msg : 'success',  result : null })
  })
export  const UpdateModel = Model =>catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await Model.findOneAndUpdate(id , req.body,{new:true})
    !result && next(new generateError('U are not authorize to update this doc', 404))
    result && res.json({msg : 'success',result})
  })



export const getOne = Model => catchError (async(req,res,next)=>{
    const {id}= req.params 
    let result =await Model.findById(id)
    !result && next(new generateError('doc not found' ,404))
    result && res.json({msg : 'success', result})
  })

export const getAll = Model => catchError (async(req,res,next)=>{
    let apiFeature = new ApiFeature(Model.find(),req.query).paginate()
    .selectFields().filterByKeyword().sortBy().Search()
    // execute
      let result = await apiFeature.mongooseQuery
      res.json({msg : 'success', page : apiFeature.page , result})
  })

