import Joi from "joi";


export const createCategorySchema = Joi.object({
    name: Joi.string().required().min(2).max(20)
})


export const getCategorySchema = Joi.object({
    id: Joi.string().required().hex().length(24)
})


export const UpdateCategorySchema = Joi.object({
    id: Joi.string().required().hex().length(24),
    name :Joi.string().required().min(2).max(20)
})

export const deleteCategorySchema = Joi.object({
    id: Joi.string().required().hex().length(24)
})
