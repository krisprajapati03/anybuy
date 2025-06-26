import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/cart/${user._id}`
        );
        setCart(res.data.cart || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    if (user?._id) {
      fetchCart();
    }
  }, [user]);

  const handleQuantityChange = async (e, cartItemId, action) => {
    e.preventDefault(); // Prevent any default form action
    try {
      const updatedCart = cart.map((item) => {
        if (item._id === cartItemId) {
          const newQuantity =
            action === "increase"
              ? item.quantity + 1
              : Math.max(1, item.quantity - 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setCart(updatedCart);

      const updatedItem = updatedCart.find((item) => item._id === cartItemId);
      if (updatedItem) {
        await axios.put(`http://localhost:5000/api/cart/${user._id}/update`, {
          cartItemId,
          quantity: updatedItem.quantity,
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (e, cartItemId) => {
    e.preventDefault();
    try {
      await axios.delete(
        `http://localhost:5000/api/cart/${user._id}/remove/${cartItemId}`
      );

      const res = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
      setCart(res.data.cart || []);
      alert("Product removed successfully");
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  if (!user) {
    return (
      <div className=" max-w-md mx-auto mt-8 p-6 rounded-lg ">
        <div className="text-center bg-white p-10 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Please Login to View Cart
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-4">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center border-b py-4">
              <img
                src={`http://localhost:5000/${item.product?.image}`}
                alt={item.product?.name}
                className="w-20 h-20 object-contain mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.product?.name}</h3>
                <p className="text-gray-600">
                  ₹{item.product?.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={(e) => handleQuantityChange(e, item._id, "decrease")}
                  className="px-2 py-1 bg-gray-300 text-gray-800 rounded-l"
                >
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={(e) => handleQuantityChange(e, item._id, "increase")}
                  className="px-2 py-1 bg-gray-300 text-gray-800 rounded-r"
                >
                  +
                </button>
              </div>
              <button
                onClick={(e) => removeFromCart(e, item._id)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </div>
          ))}

          <div className="mt-6 text-right">
            <h3 className="text-xl font-bold">
              Total: ₹{totalAmount.toFixed(2)}
            </h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/placeorder");
              }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
