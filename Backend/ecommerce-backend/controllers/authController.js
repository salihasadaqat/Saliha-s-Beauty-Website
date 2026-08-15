const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// ==========================================
// EMAIL CONFIGURATION
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ==========================================
// GENERATE JWT
// ==========================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

// ==========================================
// GENERATE OTP
// ==========================================

const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

// ==========================================
// SIGNUP
// ==========================================

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      number
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required."
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered."
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const otp = generateOTP();

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      number: number || "",
      role: "customer",
      signupOTP: otp,
      signupOTPExpires:
        new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Saliha's Beauty - Signup OTP",
      html: `
        <h2>Welcome to Saliha's Beauty 💄</h2>

        <p>Your signup verification OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP will expire in 10 minutes.</p>

        <p>Please do not share this OTP with anyone.</p>
      `
    });

    res.status(201).json({
      message:
        "Registration successful. OTP sent to your email.",
      email: user.email
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Signup failed.",
      error: error.message
    });
  }
};

// ==========================================
// VERIFY SIGNUP OTP
// ==========================================

const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required."
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Account is already verified."
      });
    }

    if (
      !user.signupOTP ||
      user.signupOTP !== otp
    ) {
      return res.status(400).json({
        message: "Invalid OTP."
      });
    }

    if (
      !user.signupOTPExpires ||
      user.signupOTPExpires < new Date()
    ) {
      return res.status(400).json({
        message: "OTP has expired."
      });
    }

    user.isVerified = true;
    user.signupOTP = null;
    user.signupOTPExpires = null;

    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      message: "Email verified successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        number: user.number,
        role: user.role
      }
    });
  } catch (error) {
    console.error(
      "Verify signup OTP error:",
      error
    );

    res.status(500).json({
      message: "OTP verification failed.",
      error: error.message
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required."
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before login."
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        number: user.number,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed.",
      error: error.message
    });
  }
};

// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required."
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email."
      });
    }

    const otp = generateOTP();

    user.resetOTP = otp;

    user.resetOTPExpires =
      new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject:
        "Saliha's Beauty - Password Reset OTP",
      html: `
        <h2>Password Reset</h2>

        <p>Your password reset OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP will expire in 10 minutes.</p>
      `
    });

    res.status(200).json({
      message:
        "Password reset OTP sent to your email."
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to send password reset OTP.",
      error: error.message
    });
  }
};

// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = async (req, res) => {
  try {
    const {
      email,
      otp,
      newPassword
    } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message:
          "Email, OTP and new password are required."
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters."
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    if (
      !user.resetOTP ||
      user.resetOTP !== otp
    ) {
      return res.status(400).json({
        message: "Invalid OTP."
      });
    }

    if (
      !user.resetOTPExpires ||
      user.resetOTPExpires < new Date()
    ) {
      return res.status(400).json({
        message: "OTP has expired."
      });
    }

    user.password =
      await bcrypt.hash(newPassword, 10);

    user.resetOTP = null;
    user.resetOTPExpires = null;

    await user.save();

    res.status(200).json({
      message:
        "Password reset successfully."
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    res.status(500).json({
      message: "Password reset failed.",
      error: error.message
    });
  }
};

// ==========================================
// GET PROFILE
// ==========================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.error(
      "Get profile error:",
      error
    );

    res.status(500).json({
      message: "Unable to get profile."
    });
  }
};

// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      number,
      profileImage,
      address
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (number !== undefined) {
      user.number = number;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    if (address !== undefined) {
      user.address = {
        ...user.address.toObject?.(),
        ...address
      };
    }

    await user.save();

    const updatedUser =
      await User.findById(user._id).select(
        "-password"
      );

    res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({
      message: "Unable to update profile."
    });
  }
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          "Current and new passwords are required."
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must contain at least 6 characters."
      });
    }

    const user = await User.findById(
      req.user._id
    );

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordMatch) {
      return res.status(400).json({
        message:
          "Current password is incorrect."
      });
    }

    user.password =
      await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      message:
        "Password changed successfully."
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to change password."
    });
  }
};

module.exports = {
  signup,
  verifySignupOTP,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword
};