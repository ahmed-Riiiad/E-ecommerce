import  Jwt from "jsonwebtoken";

 export const GenerateSignToken = payload =>{
  return token =  Jwt.sign(payload,process.env.tokenPass , 
    {expiresIn : process.env.tokenExpire} 
    )}

