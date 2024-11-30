

export const globalError = (err,req,res,next)=>{    
    let code = err.statusCode || 500
    err.status = err.status || 'error'

    if  (process.env.NODE_ENV === 'development'){
        res.status(code).json({
        status :err.status ,
        message :err.message,
        error : err,
        stack : err.stack
    })} else if (process.env.NODE_ENV === 'production'){
       
        res.status(code).json({
            status :err.status ,
            message :err.message
    })
    }
}