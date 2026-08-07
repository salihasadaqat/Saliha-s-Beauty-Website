const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");


// Generate 6 digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};


// Hash OTP
const hashOTP = (otp) => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};


// ===============================
// SIGNUP
// ===============================

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
        message: "Name, email and password are required"
      });

    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser && existingUser.isVerified) {

      return res.status(400).json({
        message: "Email is already registered"
      });

    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const otp = generateOTP();

    const otpHash = hashOTP(otp);

    const otpExpires =
      new Date(Date.now() + 10 * 60 * 1000);


    let user;


    if (existingUser) {

      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.number = number;
      existingUser.otpHash = otpHash;
      existingUser.otpExpires = otpExpires;

      user = await existingUser.save();

    } else {

      user = await User.create({

        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        number,

        isVerified: false,

        otpHash,
        otpExpires

      });

    }


    // OTP appears in backend terminal
    console.log("");
    console.log("================================");
    console.log("SIGNUP OTP:", otp);
    console.log("================================");
    console.log("");


    res.status(201).json({

      message:
        "Signup successful. Check backend terminal for OTP.",

      email: user.email

    });


  } catch (error) {

    console.error("Signup error:", error);

    res.status(500).json({

      message: "Signup failed",

      error: error.message

    });

  }

};


// ===============================
// VERIFY SIGNUP OTP
// ===============================

const verifySignupOTP = async (req, res) => {

  try {

    const {
      email,
      otp
    } = req.body;


    const user = await User.findOne({
      email: email.toLowerCase()
    });


    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }


    if (user.isVerified) {

      return res.status(400).json({
        message: "Email already verified"
      });

    }


    if (
      !user.otpHash ||
      !user.otpExpires ||
      user.otpExpires < new Date()
    ) {

      return res.status(400).json({
        message: "OTP expired"
      });

    }


    const hashedOTP = hashOTP(otp);


    if (hashedOTP !== user.otpHash) {

      return res.status(400).json({
        message: "Invalid OTP"
      });

    }


    user.isVerified = true;

    user.otpHash = null;

    user.otpExpires = null;


    await user.save();


    res.json({

      message:
        "Email verified successfully. You can now login."

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      message: "OTP verification failed",

      error: error.message

    });

  }

};


// ===============================
// LOGIN
// ===============================

const login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    const user = await User.findOne({
      email: email.toLowerCase()
    });


    if (!user) {

      return res.status(401).json({

        message: "Invalid email or password"

      });

    }


    if (!user.isVerified) {

      return res.status(403).json({

        message:
          "Please verify your email before login"

      });

    }


    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {

      return res.status(401).json({

        message: "Invalid email or password"

      });

    }


    const token = jwt.sign(

      {
        id: user._id,
        email: user.email
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    );


    res.json({

      message: "Login successful",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        number: user.number

      }

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      message: "Login failed",

      error: error.message

    });

  }

};


// ===============================
// FORGOT PASSWORD
// ===============================

const forgotPassword = async (req, res) => {

  try {

    const {
      email
    } = req.body;


    const user = await User.findOne({
      email: email.toLowerCase()
    });


    if (!user) {

      return res.json({

        message:
          "If this email exists, OTP has been generated."

      });

    }


    const otp = generateOTP();

    const otpHash = hashOTP(otp);

    const otpExpires =
      new Date(Date.now() + 10 * 60 * 1000);


    user.resetOtpHash = otpHash;

    user.resetOtpExpires = otpExpires;


    await user.save();


    // OTP appears in backend terminal
    console.log("");
    console.log("================================");
    console.log("PASSWORD RESET OTP:", otp);
    console.log("================================");
    console.log("");


    res.json({

      message:
        "OTP generated. Check backend terminal."

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      message: "Forgot password failed",

      error: error.message

    });

  }

};


// ===============================
// RESET PASSWORD
// ===============================

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
          "Email, OTP and new password are required"

      });

    }


    if (newPassword.length < 6) {

      return res.status(400).json({

        message:
          "Password must contain at least 6 characters"

      });

    }


    const user = await User.findOne({
      email: email.toLowerCase()
    });


    if (!user) {

      return res.status(400).json({

        message: "Invalid request"

      });

    }


    if (
      !user.resetOtpHash ||
      !user.resetOtpExpires ||
      user.resetOtpExpires < new Date()
    ) {

      return res.status(400).json({

        message: "OTP expired"

      });

    }


    const hashedOTP = hashOTP(otp);


    if (hashedOTP !== user.resetOtpHash) {

      return res.status(400).json({

        message: "Invalid OTP"

      });

    }


    user.password =
      await bcrypt.hash(newPassword, 10);

    user.resetOtpHash = null;

    user.resetOtpExpires = null;


    await user.save();


    res.json({

      message:
        "Password reset successfully. You can now login."

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      message:
        "Password reset failed",

      error: error.message

    });

  }

};


module.exports = {

  signup,
  verifySignupOTP,
  login,
  forgotPassword,
  resetPassword

};