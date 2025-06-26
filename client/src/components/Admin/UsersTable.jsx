import axios from "axios";
import React, { useEffect, useState } from "react";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users API logic inside the component
  const fetchUsers = async () => {
    try {
      // Make the API request to fetch users
      const response = await axios.get("http://localhost:5000/api/users");

      console.log("API Response:", response); // Log the entire response

      // Log the response data to check its structure
      console.log("Response Data:", response.data);

      // Check if the response.data is an array of users
      if (Array.isArray(response.data)) {
        if (response.data.length > 0) {
          setUsers(response.data); // Set users if the response is an array of users
        } else {
          throw new Error("No users found");
        }
      } else {
        throw new Error(
          "Unexpected response format: " + JSON.stringify(response.data)
        );
      }
    } catch (error) {
      setError("Failed to fetch users: " + error.message);
    } finally {
      setLoading(false); // Stop loading once the data is fetched
    }
  };

  // Fetch users when the component is mounted
  useEffect(() => {
    fetchUsers();
  }, []);

  // Show loading or error messages
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-10 bg-white">
      <h2 className="text-2xl font-semibold mb-5 text-center">All Users</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-left">Phone</th>
            <th className="border p-2 text-left">Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="border">
              <td className="border p-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.userType}</td>
              <td className="border p-2">{user.phone}</td>
              <td className="border p-2">{user.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
