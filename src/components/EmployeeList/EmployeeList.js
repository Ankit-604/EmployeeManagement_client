// src/components/Employee/EmployeeList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:2112/emp/getEmployee");
        const data = await response.json();
        if (response.ok) {
          setEmployees(data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:2112/emp/deleteEmployee", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: employees.find((emp) => emp._id === id).email,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Employee deleted successfully");
        setEmployees(employees.filter((emp) => emp._id !== id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((emp) => (
          <li key={emp._id}>
            {emp.name} - {emp.email} - Age: {emp.age} - Salary: ${emp.salary}
            <button onClick={() => handleEdit(emp._id)}>Edit</button>
            <button onClick={() => handleDelete(emp._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
