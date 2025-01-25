import { emailEmmiter } from "../../utils/emails/email.event.js";
import Randomstring from "randomstring";
import otpModel from "../../DB/Models/otp.model.js";
export const generateAndSendOTP = async (email, subject) => {
  const otp = Randomstring.generate({ length: 5, charset: "alphanumeric" });
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
  await otpModel.create({ email, otp, expiresAt });
  emailEmmiter.emit("sendEmail", email, otp, subject);
};
