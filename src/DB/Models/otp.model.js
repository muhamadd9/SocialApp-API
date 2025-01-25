import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    failedAttempts: { type: Number, default: 0 },
    bannedUntil: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

// i made it to deleted after 5 minutes to handle banned attempt
// and handle expires time after 2 minutes in creation of otp

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const otpModel = mongoose.model("OTP", otpSchema);

export default otpModel;
