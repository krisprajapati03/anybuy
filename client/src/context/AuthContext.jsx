import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (data?._id) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        console.error("Login succeeded but user data missing _id:", data);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

const register = async (userData) => {
  try {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      userType: userData.userType
    };

    const { data } = await axios.post(
      "http://localhost:5000/api/auth/register",
      payload,
      { withCredentials: true }
    );

    if (data?._id) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      console.error("Registration succeeded but no user object returned");
    }
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};



// import axios from "axios";
// import React, { createContext, useContext, useState } from "react";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//  const login = async (email, password) => {
//   try {
//     const { data } = await axios.post(
//       "http://localhost:5000/api/auth/login",
//       { email, password },
//       { withCredentials: true }
//     );

//     // ✅ Store in state
//     setUser(data);

//     // ✅ Store in localStorage
//     if (data?._id) {
//       localStorage.setItem("user", JSON.stringify(data));
//     } else {
//       console.error("Login succeeded but user data missing _id:", data);
//     }

//   } catch (error) {
//     console.error("Login error:", error);
//     throw error;
//   }
// };

//   const register = async (userData) => {
//     try {
//       // Ensure the API URL matches the backend server's URL and port
//       const { data } = await axios.post(
//         "http://localhost:5000/api/auth/register", // Update the URL if necessary
//         userData,
//         {
//           withCredentials: true, // Keep this if you're using cookies for authentication
//           // headers: {
//           //   'Content-Type': 'application/json', // Ensure the correct headers are sent
//           // },
//         }
//       );
//       setUser(data); // Update the user state with the backend response
//     } catch (error) {
//       // Log the error for debugging
//       console.error("Registration failed:", error.response || error.message);
//       throw error; // Re-throw the error for further handling
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     // Clear cookie logic here
//     window.location.href = "/"; // Redirect to home page
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
