import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Helper to get userId from localStorage
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user._id ? user._id : null;
};

const PlaceOrder = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart and user
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const uid = getUserId();
      setUserId(uid);
      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        const cartRes = await axios.get(`http://localhost:5000/api/cart/${uid}`);
        if (Array.isArray(cartRes.data.cart) && cartRes.data.cart.length > 0) {
          setCartItems(cartRes.data.cart);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
        setCartItems([]);
      }

      setLoading(false);
    };

    fetchCart();
  }, []);

  const getCartTotal = (items) => {
    return items.reduce((total, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
    giftOption: false,
    billingSame: true,
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.product?._id || item.productId,
        quantity: item.quantity,
        price: item.product?.price || item.price || 0,
      }));

      const amount = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const addressString = [
        formData.address,
        formData.apartment,
        formData.city,
        formData.state,
        formData.zip,
      ]
        .filter(Boolean)
        .join(", ");

      const orderData = {
        userId,
        items: orderItems,
        amount,
        address: addressString,
      };

      // Place Order API
      await axios.post("http://localhost:5000/api/order/placeorder", orderData);

      // Clear Cart
      await axios.delete(`http://localhost:5000/api/cart/clear/${userId}`);

      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("Failed to place order. Please try again.");
      setError("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="giftOption"
            checked={formData.giftOption}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300"
          />
          <label className="ml-2 text-gray-700">This order is a gift</label>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <input
            type="text"
            name="company"
            placeholder="Company (Optional)"
            value={formData.company}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-2"
          />
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-2"
            required
          />
          <input
            type="text"
            name="apartment"
            placeholder="Apartment, Suite, etc. (Optional)"
            value={formData.apartment}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-2"
          />
          <div className="grid grid-cols-3 gap-4 mt-2">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP Code"
              value={formData.zip}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-2"
            required
          />
        </div>

        {/* Billing */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="billingSame"
            checked={formData.billingSame}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300"
          />
          <label className="ml-2 text-gray-700">Use as billing address</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
