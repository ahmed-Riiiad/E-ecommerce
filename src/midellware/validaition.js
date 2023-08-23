
export const validate = (Schema)=>{
    return (req,res,next)=>{
        let inputs = {...req.body,...req.params,...req.query}
        const {error}= Schema.validate(inputs,{abortEarly:false});
        if(!error){
            next()
            }else{
            let error= error.details.map(detail=>detail.message)
            res.json(error)
    }
}
}