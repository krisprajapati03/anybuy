const express = require("express");
const {
  createCheckoutSession,
  verifyPayment,
} = require("../controllers/paymentController");
const router = express.Router();

// Route to create Stripe Checkout session
router.post("/api/payments/create-checkout-session", createCheckoutSession);

// Route to verify payment status
router.post("/api/payments/verify-payment", verifyPayment);

module.exports = router;
