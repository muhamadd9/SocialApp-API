import { providers, userModel } from "../../DB/Models/user.model.js";
import CustomError from "../../utils/errorHandling/customError.js";
import { compareHash } from "../../utils/hashing/hash.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import { subjects } from "../../utils/emails/sendEmails.js";
import { OAuth2Client } from "google-auth-library";
import { OTPVerification } from "../../utils/OTP Verification/otpVerification.js";
import { generateAndSendOTP } from "../../utils/OTP Verification/genereateAndSendOTP.js";

export const sendOTP = async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (user) return next(new CustomError("User already exists", 400));

  generateAndSendOTP(email, subjects.register);

  res.status(200).json({ success: true, message: "OTP sent successfully" });
};
export const register = async (req, res, next) => {
  const { otp, email } = req.body;

  //handle otp
  const otpVerified = await OTPVerification(email, otp, next);

  if (otpVerified) {
    const user = await userModel.create({
      ...req.body,
      isActivated: true,
    });

    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  }
};

// login with email
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  // find user
  const user = await userModel.findOne({ email });
  // user not found
  if (!user) return next(new CustomError("Email not valid", 400));

  // user not activated
  if (!user.isActivated)
    return next(new CustomError("Acctivate your account first", 400));

  // compare password with hashed password
  if (!compareHash({ plainText: password, hash: user.password }))
    return next(new CustomError("Password is wrong", 400));

  // generate token
  const access_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: "2h" },
  });

  const refresh_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: "7d" },
  });

  // reactivate account when user is deleted
  if (user.isDeleted) {
    user.isDeleted = false;
    await user.save();
  }

  return res.status(200).json({
    success: true,
    message: "Login Success",
    access_token,
    refresh_token,
  });
};

// login with gmail
export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID, // Ensure this matches your CLIENT_ID
      });
      return ticket.getPayload();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      throw new CustomError("Invalid token or audience mismatch", 401);
    }
  }

  const payload = await verify();
  const { email_verified, email, name, picture } = payload;

  if (!email_verified)
    return next(new CustomError("Email is not verified", 400));

  const user = await userModel.create({
    email,
    userName: name,
    isActivated: true,
    provider: providers.google,
  });
  const access_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: "2h" },
  });
  const refresh_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: "7d" },
  });

  return res.status(200).json({ success: true, access_token, refresh_token });
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({
    email,
    isDeleted: false,
    isActivated: true,
  });
  if (!user) return next(new CustomError("User not found", 404));

  generateAndSendOTP(email, subjects.resetPassword);

  res.status(200).json({ success: true, message: "OTP sent successfully" });
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  const user = await userModel.findOne({
    email,
    isDeleted: false,
    isActivated: true,
  });
  if (!user) return next(new CustomError("User not found", 404));

  const otpVerified = await OTPVerification(email, otp, next);

  if (!otpVerified) return next(new CustomError("Invalid OTP", 400));

  user.password = newPassword;
  user.changedAt = Date.now();
  await user.save();

  return res
    .status(200)
    .json({ success: true, message: "Password changed successfully" });
};

export const newAccessToken = async (req, res, next) => {
  const { refresh_token } = req.body;

  const payload = verifyToken({ token: refresh_token });

  const user = await userModel.findById(payload.id);
  if (!user) return next(new CustomError("User not found", 404));

  if (user.changedAt?.getTime() > payload.iat * 1000)
    return next(new CustomError("Please login again", 401));
  
  const access_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: "2h" },
  });
  return res.status(200).json({ success: true, access_token });
};
