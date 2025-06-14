import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddEmployee from "../components/AddEmployee";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:3000/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserData(response.data.user);
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setEmployees(data.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // When Update button clicked, set editingEmployee state to fill form
  const handleUpdate = (employee) => {
    setEditingEmployee(employee);
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();

      if (response.ok) {
        alert("Employee deleted successfully");
        setEmployees(employees.filter((emp) => emp._id !== employeeId));
        // If currently editing deleted employee, clear form
        if (editingEmployee && editingEmployee._id === employeeId) {
          setEditingEmployee(null);
        }
      } else {
        alert(data.error || "Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("An error occurred while deleting the employee.");
    }
  };

  // Called from AddEmployee after add/update is done, refresh employee list and clear editing
  const onFormSubmit = () => {
    setEditingEmployee(null);
    fetchEmployees();
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, <span className="text-blue-600">{userData.username}</span>!
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </header>

      <section className="dashboard-content">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Employees</h2>

        {/* Pass editingEmployee and onFormSubmit to AddEmployee */}
        <AddEmployee
          editingEmployee={editingEmployee}
          onFormSubmit={onFormSubmit}
          onCancel={() => setEditingEmployee(null)}
        />

        <ul className="mt-6 space-y-4">
          {employees.length > 0 ? (
            employees.map((employee) => (
              <li
                key={employee._id}
                className="flex justify-between items-center border border-gray-200 rounded p-4 shadow-sm hover:shadow-md transition"
              >
                <div>
                  <strong className="text-lg text-gray-900">{employee.name}</strong> -{" "}
                  <span className="text-gray-700">{employee.position}</span>{" "}
                  <span className="italic text-gray-500">
                    ({employee.department || "N/A"})
                  </span>
                </div>
                <div className="flex space-x-4">
                  {/* Update Icon */}
                  <button
                    onClick={() => handleUpdate(employee)}
                    className="text-blue-500 hover:text-blue-700 transition"
                    aria-label="Update Employee"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 17h2m2-2l7-7a2.828 2.828 0 00-4-4l-7 7-4 4v4h4l4-4z"
                      />
                    </svg>
                  </button>

                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="text-red-500 hover:text-red-700 transition"
                    aria-label="Delete Employee"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">No employees available</li>
          )}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
