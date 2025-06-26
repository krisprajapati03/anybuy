import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Import navigate

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // 👈 initialize navigate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        console.log("Fetched Products:", data);

        // Filter products with rating greater than 4.8
        const filteredProducts =
          data.products?.filter((product) => product.rating > 4.8) || [];

        setProducts(filteredProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <p className="text-center text-xl">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full py-10">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/product/${product._id}`)} // 👈 navigate on card click
              >
                {/* Product Image */}
                <div className="w-full h-60 flex items-center justify-center">
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt={product.name}
                    className="h-full object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-xl font-bold mb-1">
                    ₹{product.price}
                  </p>

                  {/* Star Rating */}
                  <div className="flex justify-center items-center gap-1 text-yellow-500 my-2">
                    {[...Array(Math.floor(product.rating || 0))].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                    {product.rating % 1 !== 0 && (
                      <Star size={16} className="text-yellow-500 opacity-50" />
                    )}
                    <span className="text-gray-500 text-sm">
                      ({product.rating || 0})
                    </span>
                  </div>

                  {/* (Optional) You can remove Buy Now Button */}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xl col-span-full">
              No featured products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
