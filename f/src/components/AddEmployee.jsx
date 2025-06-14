import React, { useEffect, useState } from "react";

const AddEmployee = ({
  editingEmployee,
  onEmployeeAdded,
  onEmployeeUpdated,
  onCancelEdit,
}) => {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
  });

  // When editingEmployee changes, update form fields
  useEffect(() => {
    if (editingEmployee) {
      setEmployeeData({
        name: editingEmployee.name || "",
        position: editingEmployee.position || "",
        department: editingEmployee.department || "",
        email: editingEmployee.email || "",
      });
    } else {
      setEmployeeData({ name: "", position: "", department: "", email: "" });
    }
  }, [editingEmployee]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, position, department, email } = employeeData;
    if (!name || !position || !department || !email) {
      alert("All fields are required: Name, Position, Department, and Email.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      let response, data;
      if (editingEmployee) {
        // Update existing employee (PUT)
        response = await fetch(
          `http://localhost:3000/api/employees/${editingEmployee._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(employeeData),
          }
        );
        data = await response.json();
        if (response.ok) {
          alert("Employee updated successfully");
          onEmployeeUpdated && onEmployeeUpdated(data.data);
        } else {
          alert(data.error || "Failed to update employee");
        }
      } else {
        // Add new employee (POST)
        response = await fetch("http://localhost:3000/api/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(employeeData),
        });
        data = await response.json();
        if (response.ok) {
          alert("Employee added successfully");
          onEmployeeAdded && onEmployeeAdded(data.data);
        } else {
          alert(data.error || "Failed to add employee");
        }
      }

      setEmployeeData({ name: "", position: "", department: "", email: "" }); // reset form
    } catch (error) {
      console.error("Error adding/updating employee:", error);
      alert("An error occurred while saving the employee.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold text-gray-800">
        {editingEmployee ? "Update Employee" : "Add Employee"}
      </h2>
      <input
        type="text"
        placeholder="Name"
        value={employeeData.name}
        onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        placeholder="Position"
        value={employeeData.position}
        onChange={(e) =>
          setEmployeeData({ ...employeeData, position: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        placeholder="Department"
        value={employeeData.department}
        onChange={(e) =>
          setEmployeeData({ ...employeeData, department: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={employeeData.email}
        onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingEmployee ? "Update" : "Add"}
        </button>
        {editingEmployee && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddEmployee;
