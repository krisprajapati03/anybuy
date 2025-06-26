import React, { useState } from "react";
import { FaBell } from "react-icons/fa6";

const AdminOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: "#243b99f6-aa35-472d-8487-0a4f29909430",
      status: "Processing",
      subtotal: "₹15264",
      date: "Sat Jun 08 2024",
    },
    {
      id: "#1a2b3c4d-5678-9101-1121-314151617181",
      subtotal: "₹9980",
      date: "Mon Jul 01 2024",
      status: "Out for Delivery",
    },
  ]);

  const handleStatusChange = (index, newStatus) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = newStatus;
    setOrders(updatedOrders);
  };

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-10 ">
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
              <th className="p-3 text-left">Subtotal</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="p-3">{order.id}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    className={`px-2 py-1 rounded ${
                      order.status === "Delivered"
                        ? "bg-green-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="p-3">{order.subtotal}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3 text-blue-500 cursor-pointer">Details</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AdminOrders;
