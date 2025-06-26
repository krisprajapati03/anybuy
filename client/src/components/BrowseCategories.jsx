import React from "react";
import { Link } from "react-router-dom";
import { Smartphone, Laptop, Headphones, Watch, Gamepad2, Tv, Home } from "lucide-react";

const categoryMappings = {
  smartphones: { name: "Smartphones", icon: <Smartphone size={48} />, path: "/allproducts?category=phone" },
  laptops: { name: "Laptops", icon: <Laptop size={48} />, path: "/allproducts?category=laptop" },
  headphones: { name: "Headphones", icon: <Headphones size={48} />, path: "/allproducts?category=headphones" },
  watches: { name: "Watches", icon: <Watch size={48} />, path: "/allproducts?category=smartwatch" },
  "gaming-accessories": { name: "Gaming Accessories", icon: <Gamepad2 size={48} />, path: "/allproducts?category=gaming-accessories" },
  television: { name: "Television", icon: <Tv size={48} />, path: "/allproducts?category=television" },
  "home-appliances": { name: "Home Appliances", icon: <Home size={48} />, path: "/allproducts?category=home-appliances" },
};

const BrowseCategories = () => {
  const categories = Object.keys(categoryMappings).map((key) => categoryMappings[key]);

  return (
    <div className="w-full bg-[#f8f9fa] py-10">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Browse Categories</h2>
        <div className="overflow-x-auto px-4">
          <div className="grid grid-flow-col auto-cols-max gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-md hover:bg-gray-200 transition min-w-[180px]"
              >
                <div className="text-blue-600">{category.icon}</div>
                <span className="mt-4 text-xl font-semibold">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseCategories;
