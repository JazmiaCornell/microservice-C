require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // using Stripe for donations/payments
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// Citation Scope: Setting up Stripe implementation for payments
// Date: 05/04/2025
// Originality: Adapted
// Source: https://docs.stripe.com/checkout/custom/quickstart

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// sends payment request to stripe for processing
app.post("/create-payment-intent", async (req, res) => {
  const { amount, email } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
      currency: "usd",
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PaymentIntent creation failed" });
  }
});

// listener
app.listen(8089, () => {
  console.log("server listening on port 8089, microservice-C");
});
