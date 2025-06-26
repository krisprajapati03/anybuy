import axios from "axios"; // ✅ Make sure axios is imported
import { Heart, ShoppingCart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user || !user._id) {
      console.error("User not logged in or missing user ID");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/cart/${user._id}`, // ✅ Pass correct userId here
        {
          productId: product._id, // ✅ Pass productId in request body
        }
      );

      console.log("Product added to cart:", response.data);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const handleAddToWishlist = async () => {
    // You can implement wishlist similarly later
    console.log("Wishlist functionality pending.");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={`http://localhost:5000/${product.image}`}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price - (product.price * product.discount) / 100}
            </span>
            {product.discount > 0 && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{product.price}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddToWishlist}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 text-gray-400 hover:text-blue-500"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
        <Link
          to={`/product/${product._id}`}
          className="mt-3 block text-center text-sm text-blue-600 hover:text-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
