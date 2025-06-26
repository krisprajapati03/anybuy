import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromCategory = location.state?.fromCategory;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editable fields
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function fetchOne() {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products/${id}`);
        setProduct(data);

        // Set editable fields from fetched product
        setPrice(data.price);
        setStock(data.stock);
        setDescription(data.description);
      } catch (err) {
        setError("Failed to fetch product: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOne();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const { data } = await axios.patch(`${BASE_URL}/api/products/${id}`, {
        price,
        stock,
        description,
      });

      alert("Product updated successfully!");
      setProduct(data.product); // update the local state with new data
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update product.");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading product...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!product)
    return <div className="p-10 text-center">Product not found.</div>;

  const fullStars = Math.floor(product.rating || 0);
  const halfStar = (product.rating || 0) % 1 !== 0;

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${BASE_URL}/${product.image?.replace(/^\/+/, "")}`;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {fromCategory ? (
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-500 underline"
        >
          ← Back to {fromCategory} Products
        </button>
      ) : (
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-500 underline"
        >
          ← Back
        </button>
      )}

      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-w-full h-auto object-cover rounded shadow-md"
          />
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            {[...Array(fullStars)].map((_, i) => (
              <FaStar key={i} className="text-yellow-500" />
            ))}
            {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
            <span className="text-gray-600">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          {/* Editable Price */}
          <div className="mt-4">
            <label className="block mb-1">Price ($):</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-32 p-2 border rounded"
            />
          </div>

          {/* Editable Stock */}
          <div className="mt-4">
            <label className="block mb-1">Stock Quantity:</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-32 p-2 border rounded"
            />
          </div>

          {/* Editable Description */}
          <div className="mt-4">
            <label className="block mb-1">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
            />
          </div>

          {/* Update Button */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
