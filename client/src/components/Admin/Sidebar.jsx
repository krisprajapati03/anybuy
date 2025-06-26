import React from "react";
import {
  FaClipboardList,
  FaTachometerAlt,
  FaThList,
  FaUsers,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      <aside className="fixed w-64 bg-blue-500 text-white p-5 h-full">
        <nav className="mt-5">
          <ul className="space-y-4">
            <li>
              <NavLink to="/admin/" className="flex items-center gap-2">
                <FaTachometerAlt /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders" className="flex items-center gap-2">
                <FaClipboardList /> Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/categories"
                className="flex items-center gap-2"
              >
                <FaThList /> Categories
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className="flex items-center gap-2">
                <FaUsers /> Users
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
