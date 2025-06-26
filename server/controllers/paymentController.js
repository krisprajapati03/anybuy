const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body;

    // Validate the items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Create the line items for the Stripe session
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr", // Set the currency to INR
        product_data: { name: item.name },
        unit_amount: item.price * 100, // price in paise (i.e., 1 INR = 100 paise)
      },
      quantity: item.quantity,
    }));

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Only accepting card payments
      line_items, // Line items from the cart
      mode: "payment", // Mode of payment, which is one-time payment in this case
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // Success URL with session_id as a query parameter
      cancel_url: `${process.env.FRONTEND_URL}/cancel`, // Cancel URL
    });

    // Return the checkout session URL for redirecting to Stripe Checkout
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Retrieve the session details from Stripe using the session ID
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check the payment status
    if (session.payment_status === "paid") {
      // Payment is successful
      res.status(200).json({ success: true, message: "Payment successful" });
    } else {
      // Payment is not successful
      res
        .status(400)
        .json({
          success: false,
          message: "Payment failed or not confirmed yet",
        });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createCheckoutSession, verifyPayment };
