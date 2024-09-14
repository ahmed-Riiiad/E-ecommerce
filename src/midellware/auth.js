import jwt from "jsonwebtoken"

export const userAuth = (req,res,next)=>{
  const token =  req.header('token')
    jwt.verify(token,process.env.tokenPass,async function (err,decoded){
        if (err) {
            res.json({msg:'token not defined',err})
        } else {
            req.userId = decoded.userId
            next()
        }
    })
}