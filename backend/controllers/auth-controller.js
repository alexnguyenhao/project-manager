import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arject.js";

// ========== REGISTER ==========
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Arcjet protect
    const decision = await aj.protect(req, { email });
    console.log("Arcjet decision:", decision.isDenied());
    if (decision.isDenied()) {
      return res.status(403).json({ message: "Invalid email address" });
    }

    // Check user tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Tạo verification token
    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 3600000),
    });

    // Gửi email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`;
    const emailSubject = "Email Verification";

    const isEmailSent = await sendEmail(newUser.email, emailSubject, emailBody);
    if (!isEmailSent) {
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    res
      .status(201)
      .json({ message: "Verification email sent. Please check your inbox." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========== VERIFY EMAIL ==========
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { userId, purpose } = payload;
    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Invalid token purpose" });
    }

    const verification = await Verification.findOne({ userId, token });
    if (!verification || verification.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isEmailVerified = true;
    await user.save();
    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========== LOGIN ==========
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    // Check email verify
    if (!user.isEmailVerified) {
      const existingVerification = await Verification.findOne({
        userId: user._id,
      });

      if (
        !existingVerification ||
        existingVerification.expiresAt < new Date()
      ) {
        // tạo token mới
        const verificationToken = jwt.sign(
          { userId: user._id, purpose: "email-verification" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        await Verification.create({
          userId: user._id,
          token: verificationToken,
          expiresAt: new Date(Date.now() + 3600000),
        });

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`;
        const isEmailSent = await sendEmail(
          user.email,
          "Email Verification",
          emailBody
        );

        if (!isEmailSent) {
          return res
            .status(500)
            .json({ message: "Failed to send verification email" });
        }

        return res.status(400).json({
          message:
            "Email not verified. Verification link sent again to your email.",
        });
      }

      return res.status(400).json({
        message:
          "Email not verified. Please check your email for the verification link.",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    user.lastLogin = new Date();
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res
      .status(200)
      .json({ message: "Login successful", token, user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

// ========== RESET PASSWORD REQUEST ==========
const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.isEmailVerified)
      return res
        .status(400)
        .json({ message: "Please verify your email first" });

    // Xóa token cũ nếu có
    await Verification.deleteMany({
      userId: user._id,
      purpose: "reset-password",
    });

    const resetPasswordToken = jwt.sign(
      { userId: user._id, purpose: "reset-password" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    await Verification.create({
      userId: user._id,
      token: resetPasswordToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
    const emailBody = `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password.</p>`;
    const isEmailSent = await sendEmail(
      email,
      "Reset your password",
      emailBody
    );

    if (!isEmailSent) {
      return res
        .status(500)
        .json({ message: "Failed to send reset password email" });
    }

    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Reset password request error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ========== VERIFY RESET PASSWORD TOKEN & RESET ==========
const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Token and passwords are required" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { userId, purpose } = payload;
    if (purpose !== "reset-password") {
      return res.status(401).json({ message: "Invalid token purpose" });
    }

    const verification = await Verification.findOne({ userId, token });
    if (!verification || verification.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  verifyResetPasswordTokenAndResetPassword,
};
