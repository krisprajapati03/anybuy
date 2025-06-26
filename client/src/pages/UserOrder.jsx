import React, { useEffect, useState } from "react";
import axios from "axios";

const UserOrder = () => {
    const userI = localStorage.getItem("userId");
    const user = { userI };
    console.log("User:", user);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user && user.userI) {
            axios
                .post("http://localhost:5000/api/order/userorders", { userId: user._id })
                .then((res) => setOrders(res.data.orders || []))
                .catch((err) => {
                    setOrders([]);
                    console.error("Failed to fetch orders:", err);
                });
        }
    }, [user]);

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="w-full bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Orders</h2>
                <div className="space-y-6 ">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-md"
                        >
                            {/* Left: Product Info */}
                            <div className="flex gap-4 items-center md:w-1/3 w-full">
                                <img
                                    src={order.photo}
                                    alt={order.name}
                                    className="w-24 h-24 object-cover rounded-lg border"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{order.name}</h3>
                                    <p className="text-gray-600">
                                        ₹{order.price} | Qty: {order.quantity}
                                    </p>
                                    <p className="text-sm text-gray-500">Date: {order.date}</p>
                                    <p className="text-sm text-gray-500">Payment: {order.method}</p>
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserOrder;