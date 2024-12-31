import  Jwt from "jsonwebtoken";

 export const GenerateSignToken = payload =>{
  return token =  Jwt.sign(payload,process.env.TOKEN_PASS , 
    {expiresIn : process.env.TOKEN_EXPIRE} 
    )}

