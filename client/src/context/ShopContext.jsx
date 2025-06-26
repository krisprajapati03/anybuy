import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const addToCart = async (productId) => {
    if (!productId) {
      toast.error("Invalid product");
      return;
    }

    setCartItems((prev) => {
      const updatedCart = [...prev]; // Copy the previous cart array
      const existingItemIndex = updatedCart.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (existingItemIndex !== -1) {
        // If product already exists, increase quantity
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        // Otherwise, add as a new item
        updatedCart.push({ product: productId, quantity: 1 });
      }

      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(
          `${backendURL}/api/cart/:userId`,
          { productId },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!productId || quantity < 1) {
      toast.error("Invalid product or quantity");
      return;
    }

    setCartItems((prev) => {
      const updatedCart = [...prev]; // Copy previous cart array
      const existingItemIndex = updatedCart.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (existingItemIndex !== -1) {
        // If product exists, update quantity
        updatedCart[existingItemIndex].quantity = quantity;
      }

      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(
          `${backendURL}/api/cart/update`,
          { productId, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const getCartItems = async () => {
    try {
      const response = await axios.get("/api/cart/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCartTotal = (cart) => {
    let totalCount = 0;

    cart.forEach((item) => {
      totalCount += item.quantity; // Summing up the quantity of each product
    });

    return totalCount;
  };

  const getCartAmount = (cart, products) => {
    let totalAmount = 0;

    cart.forEach((item) => {
      const productData = products.find(
        (product) => product._id.toString() === item.product.toString()
      );
      
      if (productData) {
        totalAmount += item.quantity * productData.price; // Multiply quantity by price
      }
    });

    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/product/list`);

      if (response.data.success) {
        const formattedProducts = response.data.products.map((product) => ({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          category: product.category,
          stock: product.stock,
        }));

        setProducts(formattedProducts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getUserCart = async (tokenValue) => {
    if (!tokenValue) return;

    try {
      const response = await axios.post(
        `${backendURL}/api/cart/get`,
        {},
        { headers: { token: tokenValue } }
      );

      if (response.data.success) {
        const formattedCart = response.data.cartData.map((item) => ({
          productId: item.product._id, // Ensure product ID is stored
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity, // Store quantity separately
        }));

        setCartItems(formattedCart);
        localStorage.setItem("cartItems", JSON.stringify(formattedCart));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      getUserCart(savedToken);
    }
  }, [token]);

  const value = {
    currency,
    search,
    setSearch,
    cartItems,
    setCartItems,
    products,
    setProducts,
    token,
    setToken,
    addToCart,
    getCartItems,
    getCartAmount,
    getCartTotal,
    updateQuantity,
  };

  return (
    <ShopContextProvider value={value}>{props.children}</ShopContextProvider>
  );
};
