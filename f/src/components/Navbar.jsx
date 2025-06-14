import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link >Employee Management System</Link>
      </div>
      <div className="space-x-6">
        <Link
          to="/login"
          className="hover:text-yellow-300 transition-colors duration-300 font-medium"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="hover:text-yellow-300 transition-colors duration-300 font-medium"
        >
          Signup
        </Link>
        <Link
          to="/dashboard"
          className="hover:text-yellow-300 transition-colors duration-300 font-medium"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
