const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    number: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    },

    // Signup OTP
    signupOTP: {
      type: String,
      default: null
    },

    signupOTPExpires: {
      type: Date,
      default: null
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    // Password reset OTP
    resetOTP: {
      type: String,
      default: null
    },

    resetOTPExpires: {
      type: Date,
      default: null
    },

    profileImage: {
      type: String,
      default: ""
    },

    address: {
      street: {
        type: String,
        default: ""
      },

      city: {
        type: String,
        default: ""
      },

      country: {
        type: String,
        default: ""
      },

      postalCode: {
        type: String,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);