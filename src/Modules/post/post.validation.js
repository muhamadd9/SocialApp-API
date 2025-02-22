import Joi from "joi";

export const createPost = Joi.object({
  content: Joi.string().min(2).max(50000).required(),
  attachments: Joi.array(),
}).or("content", "attachments");
