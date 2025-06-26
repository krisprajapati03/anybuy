import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Helper to get userId from backend or cookie (adjust as needed)
const getUserId = async () => {
  // Fallback: get userId from localStorage if you store it after login
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user._id ? user._id : null;
};

const PlaceOrder = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch userId and cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const uid = await getUserId();
      setUserId(uid);
      if (!uid) {
        setLoading(false);
        return;
      }
      try {
        // Remove withCredentials for debugging if your backend does not require cookies for /api/cart/:userId
        // Or, if your backend requires authentication, ensure you are logged in and the cookie is present

        // Try fetching cart without withCredentials (for public cart endpoint)
        let cartRes;
        try {
          cartRes = await axios.get(`http://localhost:5000/api/cart/${uid}`);
        } catch (err) {
          // If fails, try with credentials (for authenticated cart endpoint)
          cartRes = await axios.get(`http://localhost:5000/api/cart/${uid}`, {
            withCredentials: true,
          });
        }

        // Debug: log cart response
        console.log("Cart API response:", cartRes.data);

        // Defensive: check if cartRes.data.cart is an array and has items with quantity > 0
        if (
          Array.isArray(cartRes.data.cart) &&
          cartRes.data.cart.some((item) => item.quantity > 0)
        ) {
          setCartItems(cartRes.data.cart);
        } else {
          setCartItems([]);
          console.warn("Cart is empty or all items have quantity 0.");
        }
      } catch (err) {
        // Debug: log error
        console.error("Cart fetch error:", err);
        setCartItems([]);
      }
      setLoading(false);
    };
    fetchCart();
  }, []);

  // Calculate total
  const getCartTotal = (orderItems) => {
    return orderItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
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
  const navigate = useNavigate();

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
      // Build orderItems as expected by backend
      const orderItems = cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      // Build address string (adjust as needed)
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
        amount: getCartTotal(orderItems),
        address: addressString,
      };

      const result = await axios.post(
        "http://localhost:5000/api/order/placeorder",
        orderData,
        { withCredentials: true }
      );
      console.log(result.data);

      // Optionally, clear cart and redirect
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order. Please try again.");
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // if (!cartItems.length || !cartItems.some((item) => item.quantity > 0)) {
  //   // Debug: log cartItems for troubleshooting
  //   console.log("cartItems at render:", cartItems);
  //   return (
  //     <div className="text-red-600 text-center mt-10">
  //       Cart not available. Please add items to cart.
  //     </div>
  //   );
  // }


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Gift Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="giftOption"
            checked={formData.giftOption}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label className="ml-2 text-gray-700">This order is a gift</label>
        </div>

        {/* Delivery Address */}
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

        {/* Billing Address */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="billingSame"
            checked={formData.billingSame}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label className="ml-2 text-gray-700">Use as billing address</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onSubmit={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
