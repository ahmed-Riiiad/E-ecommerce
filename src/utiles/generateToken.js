import  Jwt from "jsonwebtoken";

 export const GenerateToken = (payload)=>{
   let token =  Jwt.sign(payload,'tokenPass')
   return token
}
