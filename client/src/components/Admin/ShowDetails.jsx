import React from "react";

const ShowDetails = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>

        <div className="mb-4">
          <strong>Order ID:</strong> {order._id}
        </div>

        <div className="mb-4">
          <strong>Address:</strong> {order.address}
        </div>

        <div className="mb-4">
          <strong>Payment Method:</strong> {order.paymentMethod}
        </div>

        <div className="mb-4">
          <strong>Status:</strong> {order.status}
        </div>

        <div className="mb-4">
          <strong>Order Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </div>

        <div className="mb-4">
          <strong>Products:</strong>
          <ul className="list-disc list-inside">
            {order.items.map((item, i) => (
              <li key={i}>
                Product ID: {item.productId} | Qty: {item.quantity} | ₹{item.price}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <strong>Total:</strong> ₹{order.amount}
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShowDetails;
