import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required().length(5),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
  userName: Joi.string().max(15).min(5).required(),
}).required();

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).required();

export const sendOTP = Joi.object({
  email: Joi.string().email().required(),
}).required();

export const forgetPassword = Joi.object({
  email: Joi.string().email().required(),
}).required();

export const resetPassword = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required().length(5),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
}).required();


export const newAccessToken = Joi.object({
  refresh_token: Joi.string().required(),
}).required();


export const loginWithGmail = Joi.object({
  idToken: Joi.string().required(),
})