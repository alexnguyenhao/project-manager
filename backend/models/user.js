import mongoose, { Schema } from "mongoose";

const UserSchem = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    profilePicture: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now },
    is2FAEnabled: { type: Boolean, default: false },
    twoFASOtp: { type: String, select: false },
    twoFAOtpExprires: { type: Date, select: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchem);
export default User;
