import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import AddEmployee from "./components/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";

function App() {
  return (
    <>
        <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<AddEmployee />} />
        <Route path="/employees/:id" element={<EmployeeDetails />} />
      </Routes>
    </>
  );
}

export default App;
