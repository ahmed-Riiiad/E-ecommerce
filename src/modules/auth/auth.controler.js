import { userModel } from "../../../database/models/user.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { generateError } from "../../utiles/generateError.js";
import { catchError } from "../../utiles/catchError.js";



export const signUP = catchError( async (req, res,next) => {
    let user = await userModel.findOne({email:req.body.email})
    if (user)  return next(new generateError('email already exist', 409))
    
    let result = new userModel(req.body)
   await result.save() 
   res.json({message:success , result})
  })

export const signIN = catchError((req,res,next)=>{
    const{password,email}  = req.body
    let user =  userModel.findOne({email})
    const match =  bcrypt.compare(password,user.password)
    if(user && match ){
     let token = jwt.sign({name:user.name,email:user.email,user_id:user._id,role : user.role},
        'aaaaaaaaaa')
     return res.json({message:success,token})
    }
    return next(new generateError('"email not found"',409))
})

//authentication
export const protectedRoutes = catchError(async (req,res,next)=>{
    let {token} = req.headers
    if(!token) return next(new generateError('where is token !',401))
    let decoded = jwt.verify(token,'aaaaaaaaaa')
    let user = await userModel.findById(decoded.user_id)
    if (!user) return next(new generateError('where is user !',401))
    let passwordChangeAT = parseInt(user.passwordChangeAT.getTime()/1000)
    if (passwordChangeAT > decoded.iat ) 
     return next(new generateError('inValid token !',401))
    req.user = user 
next()
})


//authorization
export const allowedTo = (...roles)=>{
    return catchError(async(req,res,next)=>{
        if(!roles.includes(req.user.role)) 
        return next( new generateError(`cannot authorize , You Are ${req.user.role}` , 401  ))
        next()
    })
}