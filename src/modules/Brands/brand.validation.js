import Joi from "joi";


export const createBrandSchema = Joi.object({
    name: Joi.string().required().min(2).max(20)
})


export const getBrandSchema = Joi.object({
    id: Joi.string().required().hex().length(24)
})


export const UpdateBrandSchema = Joi.object({
    id: Joi.string().required().hex().length(24),
    name :Joi.string().required().min(2).max(20)
})

export const deleteBrandSchema = Joi.object({
    id: Joi.string().required().hex().length(24)
})
