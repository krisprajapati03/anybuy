import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "./ProductCard.jsx";
import BrowseCategories from "../components/BrowseCategories";
import FeaturedProducts from "../components/FeaturedProducts";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-screen">
      {/* Full-screen Hero section without spaces */}
      <Hero />
      {/* Container for products */}
      <div className=" mx-auto p-4">
      <BrowseCategories /> 
      <FeaturedProducts />
      </div>
    </div>
  );
};

export default Home;