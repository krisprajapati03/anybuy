import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    condition: "",
    sort: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const qp = new URLSearchParams(location.search);
  const searchQuery = qp.get("query") || "";
  const categoryParam = qp.get("category") || "";

  const keywordMap = {
    mobile: "phone",
    earphone: "headphones",
    watch: "smartwatch",
    laptop: "laptop",
    gaming: "gaming-accessories",
    tv: "television",
    appliances: "home-appliances",
  };

  useEffect(() => {
    if (searchQuery) {
      const key = searchQuery.toLowerCase();
      if (keywordMap[key]) {
        setFilters((f) => ({ ...f, category: keywordMap[key] }));
        setAppliedFilters((f) => ({ ...f, category: keywordMap[key] }));
      } else {
        setFilters((f) => ({ ...f, category: "" }));
        setAppliedFilters((f) => {
          const { category, ...rest } = f;
          return rest;
        });
      }
    } else if (categoryParam) {
      setFilters((f) => ({ ...f, category: categoryParam }));
      setAppliedFilters((f) => ({ ...f, category: categoryParam }));
    }
  }, [searchQuery, categoryParam]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categoryParam, appliedFilters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let url;
      const qLower = searchQuery.toLowerCase();

      if (keywordMap[qLower]) {
        const params = new URLSearchParams();
        params.append("category", keywordMap[qLower]);
        url = `http://localhost:5000/api/products/filter?${params.toString()}`;
      } else if (searchQuery) {
        url = `http://localhost:5000/api/products/search?query=${encodeURIComponent(
          searchQuery
        )}`;
      } else {
        const params = new URLSearchParams();
        if (categoryParam) {
          params.append("category", categoryParam);
        }
        Object.entries(appliedFilters).forEach(([k, v]) => {
          if (v && k !== "category") params.append(k, v);
        });
        url = `http://localhost:5000/api/products/filter?${params.toString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) {
          setProducts([]);
          setLoading(false);
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    navigate(`/allproducts?${params.toString()}`);
  };

  const handleProductClick = (id) => {
    if (!id) console.error("Product ID is undefined!");
    navigate(`/product/${id}`);
  };

  return (
    <div className="flex p-6 bg-gray-100 min-h-screen">
      {/* Filters */}
      <div className="w-1/4 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold">Filters</h2>

        {/* Category */}
        <div className="mt-4">
          <label className="font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">All</option>
            <option value="laptop">Laptop</option>
            <option value="smartwatch">Smartwatch</option>
            <option value="phone">Phone</option>
            <option value="headphones">Headphones</option>
            <option value="home-appliances">Home Appliances</option>
            <option value="gaming-accessories">Gaming Accessories</option>
            <option value="television">Television</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="mt-4">
          <label className="font-medium text-gray-700">Price Range</label>
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-lg mt-2"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-lg mt-2"
          />
        </div>

        {/* Minimum Rating */}
        <div className="mt-4">
          <label className="font-medium text-gray-700">Minimum Ratings</label>
          <input
            type="number"
            name="minRating"
            min="0"
            max="5"
            placeholder="Min Rating"
            value={filters.minRating}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Condition */}
        <div className="mt-4">
          <label className="font-medium text-gray-700">Condition</label>
          <select
            name="condition"
            value={filters.condition}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">All</option>
            <option value="advance">Advance</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="mt-4">
          <label className="font-medium text-gray-700">Sort By</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <button
          onClick={applyFilters}
          className="mt-6 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </div>

      {/* Products */}
      <div className="w-3/4 ml-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : filters.category
            ? filters.category.charAt(0).toUpperCase() +
              filters.category.slice(1)
            : "All Products"}
        </h2>

        {loading && <p className="text-center">Loading products...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          {products.length > 0 ? (
            products.map((p) => (
              <div
                key={p._id || p.id}
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => handleProductClick(p._id || p.id)}
              >
                <div className="w-full h-60 mb-4 rounded-md overflow-hidden">
                  <img
                    src={`http://localhost:5000/${p.image}`}
                    alt={p.name}
                    className="h-full object-contain w-full"
                  />
                </div>
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-gray-600">₹{p.price}</p>
                <p className="text-yellow-500">⭐ {p.rating}</p>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
