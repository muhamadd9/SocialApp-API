import CustomError from "../utils/errorHandling/customError.js";

const isAuthorized = (...roles) => {
  return (req, res, next) => {
    const { user } = req;
    if (!roles.includes(user.role))
      return next(new CustomError("Not authorized", 401));
    return next();
  };
};

export default isAuthorized;
