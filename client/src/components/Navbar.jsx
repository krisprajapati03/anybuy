import { Plus, Search, ShoppingCart, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout, user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const timerRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/allproducts?query=${searchQuery}`);
    }
  };

  // Close Profile Menu on Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-rich-300 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Any-Buy
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-rich-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                >
                  <Search className="h-5 w-5 text-gray-400" />
                </button>
              </form>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center">
            <Link to="/cart" className="p-2 text-gray-700 hover:text-gray-800">
              <ShoppingCart className="h-6 w-6" />
            </Link>

            {/* Profile Dropdown */}
            <div
              className="ml-4 relative"
              onMouseEnter={() => setShowProfileMenu(true)}
              onMouseLeave={() => setShowProfileMenu(false)}
              ref={profileRef}
            >
              <button className="p-2 text-gray-700 hover:text-gray-800">
                <User className="h-6 w-6" />
              </button>

              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 -translate-y-2 translate-x-14 rounded-md shadow-lg py-1 x- z-50 bg-rich-100 ring-1 ring-black ring-opacity-5">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-rich-300"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rich-300"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm hover:bg-rich-300 bg-rich-100 text-black"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm hover:bg-rich-300 bg-rich-100 text-black"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Add Product Button */}
            {user &&
              (user.userType === "shopkeeper" ||
                user.userType === "renowned") && (
                <Link
                  to="/add"
                  className="p-2 text-gray-700 hover:text-gray-800"
                >
                  <Plus className="h-6 w-6 ml-6" />
                </Link>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
