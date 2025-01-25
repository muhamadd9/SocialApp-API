import mongoose from "mongoose";
import CustomError from "../utils/errorHandling/customError.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.query, ...req.params };

    const result = schema.validate(data, { abortEarly: false });

    if (result.error) {
      const messageList = result.error.details.map((obj) => obj.message);
      return next(new CustomError(messageList, 400));
    }
    return next();
  };
};

export const isObjectId = (val, helper) => {
  return mongoose.Types.ObjectId.isValid(val)
    ? true
    : helper.message("Invalid ObjectId!");
};
