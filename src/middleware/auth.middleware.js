import { userModel } from "../DB/Models/user.model.js";
import { asyncHandler } from "../utils/errorHandling/asyncHandler.js";
import CustomError from "../utils/errorHandling/customError.js";
import { verifyToken } from "../utils/token/token.js";
const isAuthenticaded = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  // check if it is bearer
  if (!authorization || !authorization.startsWith("Bearer"))
    return next(new CustomError("Token required", 403));

  const token = authorization.split(" ")[1];

  const decoded = verifyToken({ token });
  const user = await userModel.findById(decoded.id).lean();

  if (!user) return next(new CustomError("User not found", 404));

  if (user.changedAt?.getTime() > decoded.iat * 1000)
    return next(new CustomError("Please login again", 401));

  if (user.isDeleted)
    return next(
      new CustomError("Please login again to reactivate account", 401)
    );

  req.user = user;
  return next();
});

export default isAuthenticaded;
