import Joi from "joi";


export const createProductSchema = Joi.object({
    name: Joi.string().required().min(2).max(20)
})


export const getProductSchema = Joi.object({
    id: Joi.string().required().hex().length(24)
})


export const UpdateProductSchema = Joi.object({
    id: Joi.string().required().hex().length(24),
    name :Joi.string().required().min(2).max(20)
})

export const deleteProductSchema = Joi.object({
    id: Joi.string().required().hex().length(24)
})
