const express = require("express");
const {
  allOrders,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateOrderStatus,
  userOrders,
  verifyStripe,
} = require("../controllers/orderController.js");
const adminAuth = require("../middleware/adminAuth.js");
const { protect: authUser } = require("../middleware/auth.js");
const orderRoutes = express.Router();

//Admin Features
orderRoutes.post("/list", allOrders);
orderRoutes.post("/status", updateOrderStatus);

//Payment Features
orderRoutes.post("/placeorder", placeOrder);
// orderRoutes.post("/stripe", authUser, placeOrderStripe);
// orderRoutes.post("/razorpay", authUser, placeOrderRazorpay);

//User Features
orderRoutes.post("/userorders", userOrders);

//Verify Payment
// orderRoutes.post("/verifyStripe", adminAuth, verifyStripe);

module.exports = orderRoutes;
