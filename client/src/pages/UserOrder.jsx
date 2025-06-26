import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UserOrder = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?._id) {
      axios
        .post("http://localhost:5000/api/order/userorders", {
          userId: user._id,
        })
        .then(async (res) => {
          const ordersWithProductDetails = await Promise.all(
            res.data.orders.map(async (order) => {
              const detailedItems = await Promise.all(
                order.items.map(async (item) => {
                  const productRes = await axios.get(
                    `http://localhost:5000/api/products/${item.productId}`
                  );
                  return {
                    ...item,
                    name: productRes.data.name,
                    image: productRes.data.image,
                  };
                })
              );
              return {
                ...order,
                items: detailedItems,
              };
            })
          );
          setOrders(ordersWithProductDetails);
        })
        .catch((err) => {
          console.error("Failed to fetch orders:", err);
        });
    }
  }, [user]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="w-full bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Orders</h2>
        <div className="space-y-6">
          {orders.map((order) =>
            order.items.map((item, idx) => (
              <div
                key={order._id + idx}
                className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-md"
              >
                {/* Left: Product Info */}
                <div className="flex gap-4 items-center md:w-1/3 w-full">
                  <div className="w-24 h-24 flex items-center justify-center border rounded-lg bg-white">
                    <img
                        src={`http://localhost:5000/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-contain"
                    />
                    </div>
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      ₹{item.price} | Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Payment: {order.paymentMethod}</p>
                  </div>
                </div>

                {/* Middle: Status */}
                <div className="flex justify-center md:w-1/3 w-full">
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full ${
                      order.status === "Packing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Right: Button */}
                <div className="flex justify-center md:w-1/3 w-full">
                  <button className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition">
                    Track Order
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrder;
