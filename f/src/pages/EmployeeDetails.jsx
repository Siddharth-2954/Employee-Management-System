import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch employee details");
        }

        const data = await response.json();
        setEmployee(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-48 text-gray-600">Loading employee details...</div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto mt-10 p-4 bg-red-100 text-red-700 rounded">
        Error: {error}
      </div>
    );

  if (!employee)
    return (
      <div className="max-w-md mx-auto mt-10 p-4 bg-yellow-100 text-yellow-700 rounded">
        Employee data not found.
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4">{employee.name}</h2>
      <p className="mb-2">
        <span className="font-semibold">Position:</span> {employee.position}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Department:</span> {employee.department}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Email:</span> {employee.email}
      </p>
      {/* Add more fields here if your API provides them */}
    </div>
  );
};

export default EmployeeDetails;
