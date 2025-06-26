import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000"; // adjust if needed

const categoryMap = {
  "home-appliances": "Home Appliances",
  headphones: "Headphones",
  laptop: "Laptop",
  "gaming-accessories": "Gaming Accessories",
  phone: "Phone",
  television: "Television",
  smartwatch: "Smartwatch",
};

const CategoriesTable = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // 🛑 Important for navigation

  const getImageUrl = (img) => {
    if (!img) return "";
    const path = Array.isArray(img) ? img[0] : img;
    return path.startsWith("http")
      ? path
      : `${BASE_URL}/${path.replace(/^\/+/, "")}`;
  };

  const handleCategoryDetails = async (categoryKey) => {
    setSelectedCategory(categoryKey);
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/products/category/${categoryKey}`
      );

      if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        throw new Error(`Unexpected response format: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      setError("Failed to load products: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setProducts([]);
    setError(null);
  };

  const handleProductDetails = (productId) => {
    navigate(`/products/${productId}`); // 🛑 Navigate to your Product.jsx page
  };

  if (selectedCategory) {
    return (
      <div className="p-10  min-h-screen">
        <button onClick={handleBack} className="mb-5 text-blue-500 underline">
          ← Back to Categories
        </button>
        <h2 className="text-2xl font-semibold mb-5">
          {categoryMap[selectedCategory]}
        </h2>

        {loading && <div>Loading products…</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="bg-white p-5 shadow-md rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-2">
                      <img
                        src={getImageUrl(p.image)}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.brand}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded ${
                          p.stock > 0
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {p.stock > 0 ? "In stock" : "Out of stock"}
                      </span>
                    </td>
                    <td className="p-3">₹{p.price}</td>
                    <td className="p-3 text-blue-500 cursor-pointer">
                      <button onClick={() => handleProductDetails(p._id)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  const entries = Object.entries(categoryMap);
  return (
    <div className="p-10  min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-5">
        All Categories
      </h2>
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, label]) => (
            <tr key={key} className="border-b hover:bg-gray-50">
              <td className="p-3">{label}</td>
              <td
                className="p-3 text-blue-500 cursor-pointer"
                onClick={() => handleCategoryDetails(key)}
              >
                Details
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
