import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing from .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;