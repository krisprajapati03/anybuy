const express = require("express");
const {
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
  clearCartController
} = require("../controllers/cartController");

const router = express.Router();

// router.post("/:userId", addToCart); // Add product to cart
router.get("/:userId", getUserCart);
router.put("/:userId/", addToCart);
router.put("/:userId/update", updateCartItem);
router.delete("/:userId/remove/:cartId", removeFromCart);
router.delete("/clear/:userId", clearCartController);

module.exports = router;
