import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import { generateError } from "../utiles/generateError.js";


export const Options = (folderName)=>{
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `/UpLoads/${folderName}`)
        },
        filename: function (req, file, cb) {
        cb(null,  uuidv4() + '-' + file.originalname )
        }
      })
      function fileFilter (req, file, cb) {
        
        if(file.mimetype.startsWith('image')){
    
            cb(null, true)
        }else{
            
            cb(new generateError('images only', 400 ), false)
        }  
    }
    return multer({ storage,fileFilter})
      
}
export const upLoadFile = (folderName,filename)=>
Options(folderName).single(filename)



export const upLoadFiles = (folderName,arrayOfFields)=>
Options(folderName).fields(arrayOfFields)




