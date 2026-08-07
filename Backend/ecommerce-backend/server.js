const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {

  res.json({
    message: "Saliha's Beauty Backend is running!"
  });

});


app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/products",
  productRoutes
);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log(
      "MongoDB connected successfully"
    );


    app.listen(
      process.env.PORT || 5000,
      () => {

        console.log(
          `Server running on http://localhost:${process.env.PORT || 5000}`
        );

      }
    );

  })
  .catch((error) => {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

  });