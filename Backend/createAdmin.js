const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    const email =
      "admin@salihasbeauty.com";

    const password =
      "Admin123";

    const existingAdmin =
      await User.findOne({ email });

    if (existingAdmin) {

      existingAdmin.isAdmin = true;
      existingAdmin.isVerified = true;

      await existingAdmin.save();

      console.log(
        "Existing user is now Admin."
      );

    } else {

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      await User.create({

        name: "Saliha Admin",

        email,

        password: hashedPassword,

        number: "03000000000",

        isVerified: true,

        isAdmin: true

      });

      console.log(
        "Admin created successfully!"
      );

    }

    console.log(
      "Email:",
      email
    );

    console.log(
      "Password:",
      password
    );

    process.exit();

  } catch (error) {

    console.error(
      "Admin creation failed:",
      error
    );

    process.exit(1);

  }

};

createAdmin();