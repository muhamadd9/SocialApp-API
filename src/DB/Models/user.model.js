import { model, Schema } from "mongoose";
import { generateHash } from "../../utils/hashing/hash.js";

export const roles = {
  user: "user",
  admin: "admin",
};
export const providers = {
  system: "system",
  google: "google",
};
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already taken"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providers.system;
      },
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username is already taken"],
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    role: { type: String, enum: Object.values(roles), default: roles.user },
    changedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.system,
    },
    tempEmail: {
      type: String,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
      lowercase: true,
    },
    profileImage: {
      secure_url: String,
      public_id: String,
    },
  },

  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = generateHash({ plainText: this.password });
  }
  return next();
});

export const userModel = model("User", userSchema);
