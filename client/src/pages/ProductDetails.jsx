import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaHeart,
  FaInstagram,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (val > 0) setQuantity(val);
  };

  const handleAddToCart = async () => {
    try {
      if (!user || !user._id) {
        alert("Please log in to add products to the cart.");
        return;
      }

      // Update localStorage
      let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProductIndex = currentCart.findIndex(
        (p) => p.id === product.id
      );

      if (existingProductIndex !== -1) {
        currentCart[existingProductIndex].quantity += quantity;
      } else {
        currentCart.push({ ...product, quantity });
      }

      localStorage.setItem("cart", JSON.stringify(currentCart));

      // Send request to update the cart in the database
      await axios.put(`http://localhost:5000/api/cart/${user._id}`, {
        productId: product._id,
        quantity: quantity, // important!
      });

      console.log("Cart updated on server successfully!");
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-red-500">Product not found.</div>
    );
  }

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 !== 0;
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `http://localhost:5000/${product.image}`;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Image */}
        <div className="md:w-1/2 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-w-full h-auto object-cover rounded shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-yellow-500">
              {Array.from({ length: fullStars }).map((_, i) => (
                <FaStar key={i} />
              ))}
              {hasHalfStar && <FaStarHalfAlt />}
            </div>
            <span className="text-gray-600">(8 reviews)</span>
          </div>

          <p className="text-2xl text-gray-800 font-semibold mt-4">
            ₹{product.price}
          </p>

          <p className="text-gray-600 mt-2">
            Availability:{" "}
            <span
              className={`font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </span>
          </p>

          {/* Quantity Input */}
          <div className="mt-4">
            <label className="block mb-1 text-gray-700 font-medium">
              Quantity:
            </label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20 p-2 border rounded"
              min="1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              <FaShoppingCart /> Add to Cart
            </button>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={() => navigate("/placeorder")}
            >
              Buy Now
            </button>

            <button className="flex items-center gap-2 text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition">
              <FaHeart className="text-red-500" /> Add to Wishlist
            </button>
          </div>

          {/* Product Meta Info */}
          <div className="mt-6 text-sm text-gray-600 space-y-1">
            <p>
              ID: <span className="font-medium">{product._id}</span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-medium">Share:</span>
              <FaFacebookF className="cursor-pointer hover:text-blue-600" />
              <FaTwitter className="cursor-pointer hover:text-blue-400" />
              <FaInstagram className="cursor-pointer hover:text-pink-600" />
              <FaYoutube className="cursor-pointer hover:text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-10">
        <ul className="flex border-b text-gray-600">
          <li className="mr-8 pb-2 border-b-2 border-blue-600 text-blue-600 font-medium cursor-pointer">
            Description
          </li>
          <li className="pb-2 border-b-2 border-transparent hover:border-blue-600 cursor-pointer">
            Additional info
          </li>
        </ul>

        <div className="mt-4">
          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
