import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminOrders from "../../components/Admin/AdminOrders";
import CategoriesTable from "../../components/Admin/CategoriesTable";
import ProductTable from "../../components/Admin/ProductTable";
import Sidebar from "../../components/Admin/Sidebar";
import UsersTable from "../../components/Admin/UsersTable";

const Dashboard = () => {
  return (
    <div className="w-full p-0">
      {/* Sidebar always visible */}
      <div className="w-[30%]">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="py-10  w-[70%] ml-[25%]">
        <Routes>
          <Route path="/" element={<ProductTable />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<UsersTable />} />
          <Route path="categories" element={<CategoriesTable />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
