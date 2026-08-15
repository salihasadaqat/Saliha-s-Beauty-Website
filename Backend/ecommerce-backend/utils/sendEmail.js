const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = async (email, otp, purpose) => {

  const subject =
    purpose === "signup"
      ? "Saliha's Beauty - Email Verification OTP"
      : "Saliha's Beauty - Password Reset OTP";

  const message =
    purpose === "signup"
      ? "Use this OTP to verify your Saliha's Beauty account."
      : "Use this OTP to reset your Saliha's Beauty password.";

  await transporter.sendMail({

    from: `"Saliha's Beauty" <${process.env.EMAIL_USER}>`,

    to: email,

    subject,

    html: `
      <div style="font-family: Arial; padding: 20px;">

        <h2 style="color: #e83e8c;">
          💄 Saliha's Beauty
        </h2>

        <p>${message}</p>

        <h1 style="letter-spacing: 8px;">
          ${otp}
        </h1>

        <p>
          This OTP will expire in <strong>10 minutes</strong>.
        </p>

        <p>
          If you did not request this code, please ignore this email.
        </p>

      </div>
    `
  });
};

module.exports = sendOTPEmail;