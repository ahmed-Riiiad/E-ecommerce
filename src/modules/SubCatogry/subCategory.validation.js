import Joi from "joi";


export const createSubCategorySchema = Joi.object({
    name: Joi.string().required().min(2).max(20)
})


export const getSubCategorySchema = Joi.object({
    id: Joi.string().required().hex().length(24)
})


export const UpdateSubCategorySchema = Joi.object({
    id: Joi.string().required().hex().length(24),
    name :Joi.string().required().min(2).max(20)
})

export const deleteSubCategorySchema= Joi.object({
    id: Joi.string().required().hex().length(24)
})
