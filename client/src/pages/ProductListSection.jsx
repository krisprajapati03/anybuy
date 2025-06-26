// src/components/ProductListSection.jsx
import React from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { products } from "../assets/assets"; // Ensure this path points to your products data

const ProductListSection = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => {
          // Calculate full stars and check for a half star
          const fullStars = Math.floor(product.rating);
          const hasHalfStar = product.rating - fullStars > 0;
          return (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={`http://localhost:5000/${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="mt-2 text-gray-600">₹{product.price}</p>w{" "}
                <div className="flex items-center mt-2 text-yellow-500">
                  {Array.from({ length: fullStars }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  {hasHalfStar && <FaStar className="half-star" />}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductListSection;
