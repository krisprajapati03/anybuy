import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa6";
import ShowDetails from "./ShowDetails.jsx"

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal

  // ✅ Fetch all orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/order/list");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Handle status update
  const handleStatusChange = async (orderId, newStatus) => {
  try {
    await axios.post("http://localhost:5000/api/order/status", {
      orderId: orderId,
      status: newStatus,
    });

    // Update UI immediately
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  } catch (err) {
    console.error("Failed to update status:", err);
    alert("Status update failed");
  }
};


  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">All Orders</h2>
          <div className="flex items-center gap-4">
            <FaBell className="text-xl" />
            <img
              src="https://api.dicebear.com/6.x/initials/svg?seed=A B"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <button className="text-blue-500">Log Out</button>
          </div>
        </div>

        <table className="w-full bg-white mt-5 shadow-md rounded-lg">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{order._id}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className={`px-2 py-1 rounded ${
                      order.status === "Delivered"
                        ? "bg-green-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="p-3">₹{order.amount}</td>
                <td className="p-3">{order.paymentMethod}</td>
                <td className="p-3">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td
                  className="p-3 text-blue-500 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  Details
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Details Popup */}
        {selectedOrder && (
          <ShowDetails
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminOrders;
