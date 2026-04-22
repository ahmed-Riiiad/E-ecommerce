

// export const globalError = (err,req,res,next)=>{    
//     let code = err.statusCode || 500
//     err.status = err.status || 'error'

//     if  (process.env.NODE_ENV === 'dev'){
//         res.status(code).json({
//         status :err.status ,
//         message :err.message,
//         error : err,
//         stack : err.stack
//     })} else if (process.env.NODE_ENV === 'prod'){
       
//         res.status(code).json({
//             status :err.status ,
//             message :err.message
//     })
//     }
// }

export const globalError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ message });
  };
  