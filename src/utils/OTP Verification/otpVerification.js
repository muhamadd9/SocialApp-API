import CustomError from "../errorHandling/customError.js";
import otpModel from "../../DB/Models/otp.model.js";

export const OTPVerification = async (email, otp, next, query) => {
  const otpDoc = await otpModel.findOne({ email });
  // check if OTP document exists
  if (!otpDoc) {
    return next(new CustomError("Invalid OTP", 400));
  }

  // check if OTP has expired
  const currentTime = new Date();
  if (otpDoc.expiresAt < currentTime) {
    return next(new CustomError("OTP expired. Please request a new one.", 400));
  }

  //check if failedAttempts is greater than or equal to 5
  if (otpDoc.failedAttempts >= 5) {
    const currentTime = new Date();

    if (otpDoc.bannedUntil && otpDoc.bannedUntil > currentTime) {
      return next(
        new CustomError(
          "Too many failed attempts. Try again after 5 minutes.",
          400
        )
      );
    }

    // if bannedUntil is over
    if (otpDoc.bannedUntil && otpDoc.bannedUntil <= currentTime) {
      await otpModel.findByIdAndUpdate(otpDoc._id, {
        failedAttempts: 0,
        bannedUntil: null,
      });
    }
  }

  // check if OTP is invalid
  if (otpDoc.otp !== otp) {
    await otpModel.findByIdAndUpdate(otpDoc._id, {
      $inc: { failedAttempts: 1 },
      ...(otpDoc.failedAttempts + 1 >= 5 && {
        bannedUntil: new Date(Date.now() + 5 * 60 * 1000),
      }),
    });
    return next(new CustomError("Invalid OTP", 400));
  }
  // if otp is valid
  await otpModel.findByIdAndDelete(otpDoc._id);

  return true;
};
