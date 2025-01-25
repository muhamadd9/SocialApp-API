import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const generateToken = ({
  payload,
  signiture = process.env.JWT_SECRET,
  options = {},
}) => {
  return jwt.sign(payload, signiture, options);
};

export const verifyToken = ({
  token,
  signiture = process.env.JWT_SECRET,
  options = {},
}) => {
  return jwt.verify(token, signiture, options);
};
