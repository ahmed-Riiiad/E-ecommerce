import { userModel } from "../../../database/models/user.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { generateError } from "../../utiles/generateError.js";
import { catchError } from "../../utiles/catchError.js";
import { sendEmail } from "../../utiles/email.js";


// signUp
export const signUP = catchError( async (req, res,next) => {
    let user = await userModel.findOne({email:req.body.email})
    if (user)  return next(new generateError('email already exist', 409))
    let result = new userModel(req.body)
   await result.save() 
   sendEmail(user)
   res.json({message:success , result})
  })

// verify
export const verify = async(req,res,next)=>{
 const {token } = req.params
 jwt.verify(token ,'tttttttt' , async (err , decoded)=>{
    if (err){
        return res.json(err)
    }else {
        await userModel.findOneAndUpdate({email : decoded.email},{ verified : true})
        res.status(201).json({ status:"success" })
    }
 })
 
}

  // log In
export const signIN = catchError((req,res,next)=>{
    const{password,email}  = req.body
    if(!email || ! password){
        return next(new generateError('"email & password not provided "',400))
    }
    let user =  userModel.findOne({email})
    const match =  bcrypt.compare(password,user.password)
    if  (user && match ){
     let token = jwt.sign(
        {   name:user.name,
            email:user.email,
            user_id:user._id,
            role : user.role
        }, process.env.tokenPass , {expiresIn : process.env.tokenExpire}
    )
    // send jwt in cookie to prevent attacker hack pass in local storage 
    const cookieOptions = {
        expires : new Date(
          Date.now() + process.env.tokenCookieExpire * 24 * 60 * 60 * 1000
        ),
        httpOnly : true
      }
      if(process.env.NODE_ENV === 'production') cookieOptions.secure = true
      res.cookie('jwt', token ,cookieOptions )
     return res.status(201).json({ status:"success", token })
    }
    return next(new generateError('"email not found"',409))
})

//authentication
export const protectedRoutes = catchError(async (req,res,next)=>{
    // 1-get token and check it
    let token
    if (req.headers.token && req.headers.token.startWith('Bearer')){
        token = req.headers.token.split(' ')[1]
    }
    if(!token) return next(new generateError(' You Are not Logged In ',401))

    // 2- verify token
    let decoded = jwt.verify(token,process.env.tokenPass)

    //3- check if user still exit 
    let user = await userModel.findById(decoded.user_id)
    if (!user) return next(new generateError('where is user !',401))    

    // 4- check if user changed password after token was issued
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

//forget Password
export const forgetPassword = catchError(async (req,res,next) =>{
//get user based on posted email
const user = await userModel.findOne({email:req.body.email})
if (!user)  return next(new generateError('email not exist', 404))

//generate random reset token
const resetToken = userModel.createPasswordResetToken()
await userModel.save({validateBeforeSave : false })


//send it to user email 
const resetUrl = `${req.protocol}://${req.get('host')}
/Api/v1/auth/ResetPassword/${resetToken}`

const message = `Forget Your Password ? 
PLZ Submit Your New Password To : ${resetUrl}`
try {
    await sendEmail({
        email :userModel.email ,
        subject : 'Your password reset token (valid for 10 minuets)',
        message
    })
    res.status(200).json({
        status : 'Success',
        message : 'token sent to email'
    })
} catch (err) {
    userModel.PasswordResetToken =undefined ,
    userModel.PasswordResetExpires = undefined 
await userModel.save({validateBeforeSave : false })
return next(new generateError('There Was An Error While Sending the E-mail;', 500 ))

}
})

//reset password
export const ResetPassword = catchError(async (req,res,next) =>{
    //get user based on token
    const hashedToken = crypto.createHash('sha256')
    .update(req.params.token)
    .digest('hex')
  
    const user = await userModel.findOne({
        PasswordResetToken : hashedToken,
        PasswordResetExpires : {$gt : Date.now()}
    })
    
    //if token has not expire ,and there is an user , set the new password
    if (!user)  return next(new generateError('token not valid', 404))

    await userModel.save({validateBeforeSave : false })
    user.password = req.body.password
    user.PasswordResetToken = undefined
    user.PasswordResetExpires = undefined
    await user.save()

    //4- log the user in , send jwt 
    let token = jwt.sign(
        {   name:user.name,
            email:user.email,
            user_id:user._id,
            role : user.role
        }, process.env.tokenPass ,{expiresIn : process.env.tokenExpire}
    )
     // send jwt in cookie to prevent attacker hack pass in local storage 
     const cookieOptions = {
        expires : new Date(
          Date.now() + process.env.tokenCookieExpire * 24 * 60 * 60 * 1000
        ),
        httpOnly : true
      }
      if(process.env.NODE_ENV === 'production') cookieOptions.secure = true
      res.cookie('jwt', token ,cookieOptions )

      res.status(201).json({ status:"success", token })
    })

//update password
    export const updatePassword = catchError(async (req,res,next) =>{
        // 1- get user   
        const user = await userModel.findById(req.user.id)  
        // 2- check if current pass is correct 
        const match =  bcrypt.compare(req.body.currentPassword , user.password )
        if (!match)  return next(new generateError('password not correct', 401))
        // 3- update pass 
        user.password = req.body.password
        await user.save()
        // 4- log the user in , send jwt 
        let token = jwt.sign(
            {   name:user.name,
                email:user.email,
                user_id:user._id,
                role : user.role
            }, process.env.tokenPass ,{expiresIn : process.env.tokenExpire}
        )
         // send jwt in cookie to prevent attacker hack pass in local storage 
    const cookieOptions = {
        expires : new Date(
          Date.now() + process.env.tokenCookieExpire * 24 * 60 * 60 * 1000
        ),
        httpOnly : true
      }
      if(process.env.NODE_ENV === 'production') cookieOptions.secure = true
      res.cookie('jwt', token ,cookieOptions )
          res.status(200).json({message:'success',token})
        })