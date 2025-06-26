import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products`);
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError("Failed to fetch products: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getImageUrl = (img) => {
    if (!img) return "";
    const path = Array.isArray(img) ? img[0] : img;
    return path.startsWith("http")
      ? path
      : `${BASE_URL}/${path.replace(/^\/+/, "")}`;
  };

  const handleRemove = async (productId) => {
    const ok = window.confirm("Are you sure you want to remove this product?");
    if (!ok) return;

    try {
      await axios.delete(`${BASE_URL}/api/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete. Please try again.");
    }
  };

  if (loading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;

  return (
    <div className=" bg-white p-5 shadow-md rounded-lg min-h-screen">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b hover:bg-gray-100">
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
              <td className="p-3 flex justify-center items-center gap-8">
                <button
                  onClick={() => navigate(`/products/${p._id}`)}
                  className="text-blue-500 hover:underline"
                >
                  Details
                </button>
                <button
                  onClick={() => handleRemove(p._id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Floating + button */}
      <button
        onClick={() => navigate("/addproduct")}
        className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
      >
        <FaPlus size={24} />
      </button>
    </div>
  );
};

export default ProductTable;
