const User = require("../models/User");
const Product = require("../models/Product");

// @desc Add or increase a product quantity in the user's cart
// @route PUT /api/cart/:userId
exports.addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product already exists in user's cart
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // If exists, update the quantity
      existingItem.quantity += quantity;
    } else {
      // Else, push new product into cart
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.json({ message: "Cart updated successfully", cart: user.cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get the user's cart with product details
// @route GET /api/cart/:userId
exports.getUserCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Properly populate the product inside cart
    const user = await User.findById(userId).populate({
      path: "cart.product", // <<< correctly populate "product" inside "cart"
      model: "Product",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User cart retrieved successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error fetching user cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Update product quantity in the user's cart (in the cart object itself)
exports.updateCartItem = async (req, res) => {
  const { userId } = req.params;
  const { cartItemId, quantity } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the item in the user's cart and update the quantity
    const cartItem = user.cart.find(
      (item) => item._id.toString() === cartItemId
    );
    if (cartItem) {
      cartItem.quantity = quantity;
      await user.save(); // Save the updated user with the modified cart
      return res.status(200).json({ message: "Cart updated successfully" });
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Remove a product from user's cart
// @route DELETE /api/cart/:userId/remove/:cartId
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, cartId } = req.params;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the cart item by filtering out the matching cartId
    user.cart = user.cart.filter((item) => item._id.toString() !== cartId);

    await user.save();

    res.json({
      message: "Product removed from cart successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};
