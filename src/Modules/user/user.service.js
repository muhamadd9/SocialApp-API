import { userModel } from "../../DB/Models/user.model.js";
import { emailEmmiter } from "../../utils/emails/email.event.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import CustomError from "../../utils/errorHandling/customError.js";
import { compareHash, generateHash } from "../../utils/hashing/hash.js";
import Randomstring from "randomstring";
import otpModel from "../../DB/Models/otp.model.js";
import { subjects } from "../../utils/emails/sendEmails.js";
import { cloud } from "../../utils/multer/cloudinary.multer.js";
// get Profile
export const profile = async (req, res, next) => {
  const { user } = req;
  // decrypt phone
  const phone = decrypt({ cipherText: user.phone });

  return res.status(200).json({ success: true, results: { ...user, phone } });
};

// update profile
export const updateProfile = async (req, res, next) => {
  if (req.body.phone) req.body.phone = encrypt({ plainText: req.body.phone });
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (req.body.email) {
    updatedUser.isActivated = false;
    await updatedUser.save();
    emailEmmiter.emit("sendEmail", req.body.email);
  }
  return res.status(200).json({ success: true, results: updatedUser });
};

// change password
export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  // compare password with hashed password

  if (!compareHash({ plainText: oldPassword, hash: req.user.password }))
    return next(new CustomError("Password is wrong", 400));

  const newHashedPassword = generateHash({
    plainText: newPassword,
  });

  const updatedUser = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { password: newHashedPassword, changedAt: Date.now() },
      { new: true, runValidators: true }
    )
    .select("-password");

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
    results: updatedUser,
  });
};

export const deactivateAcccount = async (req, res, next) => {
  const updatedUser = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { isDeleted: true },
      { new: true, runValidators: true }
    )
    .select("-password");
  return res.status(200).json({ success: true, results: updatedUser });
};

// Update Email
export const updateEmail = async (req, res, next) => {
  const { email, password } = req.body;
  const checkEmail = await userModel.findOne({ email, isDeleted: false });

  if (checkEmail) return next(new CustomError("Email already exists", 400));

  const user = await userModel.findOne({ _id: req.user._id, isDeleted: false });

  if (!user) return next(new CustomError("User not found", 404));
  if (!compareHash({ plainText: password, hash: user.password }))
    return next(new CustomError("Password is wrong", 400));

  user.tempEmail = email;
  await user.save();

  const otp = Randomstring.generate({ length: 5, charset: "alphanumeric" });
  await otpModel.create({ email, otp });
  emailEmmiter.emit("sendEmail", email, otp, subjects.updateEmail);

  return res.status(200).json({ success: true, message: "Verify your email" });
};

// Verify Updated Email
export const verifyUpdatedEmail = async (req, res, next) => {
  const { otp } = req.body;
  const { user } = req;
  console.log(user, otp);
  const checkOTP = await otpModel.findOne({ otp, email: user.tempEmail });
  if (!checkOTP) return next(new CustomError("Invalid OTP", 400));

  await userModel.findOneAndUpdate(
    { _id: user._id },
    { email: user.tempEmail }
  );

  await otpModel.findByIdAndDelete(checkOTP._id);

  return res.status(200).json({ success: true, message: "Email updated" });
};

// update Profile Image localy
export const updateProfileImage = async (req, res, next) => {
  const user = await userModel
    .findOneAndUpdate(
      req.user._id,
      {
        profileImage: req.file.finalPath,
      },
      { new: true, runValidators: true }
    )
    .select("-password");
  return res.status(200).json({ success: true, user });
};

// update Profile Image Cloud
export const updateProfileImageCloud = async (req, res, next) => {
  const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, {
    folder: `${process.env.app_name}/user/${req.user._id}`,
  });

  const user = await userModel
    .findOneAndUpdate(
      req.user._id,
      {
        profileImage: { secure_url, public_id },
      },
      // False to update on old data and destroy old image
      { new: false }
    )
    .select("-password");
  if (user.profileImage?.public_id)
    await cloud.uploader.destroy(user.profileImage.public_id);

  return res
    .status(200)
    .json({ success: true, message: "Profile image updated successfully" });
};
