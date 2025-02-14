import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const API_BASE_URL = "https://employeemanagement-server-p9xc.onrender.com";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    age: "",
    salary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // Validate data before sending
      if (
        !employeeData.name ||
        !employeeData.email ||
        !employeeData.age ||
        !employeeData.salary
      ) {
        throw new Error("Please fill all fields");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(employeeData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Age validation
      if (employeeData.age < 18 || employeeData.age > 100) {
        throw new Error("Age must be between 18 and 100");
      }

      // Salary validation
      if (employeeData.salary <= 0) {
        throw new Error("Salary must be greater than 0");
      }

      const response = await fetch(`${API_BASE_URL}/emp/addEmployee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: employeeData.name,
          email: employeeData.email,
          age: Number(employeeData.age),
          salary: Number(employeeData.salary),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check for duplicate email error
        if (
          errorData.error &&
          errorData.error.includes("duplicate key error") &&
          errorData.error.includes("email")
        ) {
          throw new Error("An employee with this email already exists");
        }

        throw new Error(errorData.message || "Failed to add employee");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      alert("Employee added successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert(error.message || "Failed to add employee");

      // Clear email field if it's a duplicate email error
      if (error.message === "An employee with this email already exists") {
        setEmployeeData((prev) => ({
          ...prev,
          email: "",
        }));
      }
    }
  };

  return (
    <StyledWrapper>
      <div className="container">
        <h2>Add New Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter employee name"
              value={employeeData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={employeeData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="Enter age"
                value={employeeData.age}
                onChange={handleChange}
                required
                min="18"
                max="100"
              />
            </div>

            <div className="form-group half">
              <label>Salary (₹)</label>
              <input
                type="number"
                name="salary"
                placeholder="Enter salary"
                value={employeeData.salary}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="cancel"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="submit">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
  padding: 20px;

  .container {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
    transition: all 0.3s ease;
  }

  h2 {
    color: #1a73e8;
    margin-bottom: 30px;
    text-align: center;
    font-size: clamp(24px, 4vw, 32px);
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .half {
    flex: 1;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
    font-size: clamp(14px, 2vw, 16px);
  }

  input {
    width: 100%;
    padding: clamp(10px, 2vw, 12px);
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: clamp(14px, 2vw, 16px);
    transition: all 0.3s ease;
    box-sizing: border-box;
    background: white;

    &:focus {
      outline: none;
      border-color: #1a73e8;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
    }
  }

  .button-group {
    display: flex;
    gap: 15px;
    margin-top: 30px;
  }

  button {
    flex: 1;
    padding: clamp(10px, 2vw, 12px);
    border: none;
    border-radius: 8px;
    font-size: clamp(14px, 2vw, 16px);
    cursor: pointer;
    transition: all 0.3s ease;

    &.submit {
      background: #1a73e8;
      color: white;

      &:hover {
        background: #1557b0;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &.cancel {
      background: #f5f5f5;
      color: #333;

      &:hover {
        background: #e0e0e0;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  /* Mobile Devices */
  @media (max-width: 480px) {
    padding: 10px;

    .container {
      padding: 20px;
      border-radius: 15px;
    }

    .form-row {
      flex-direction: column;
      gap: 0;
    }

    .button-group {
      flex-direction: column-reverse;
    }

    button {
      width: 100%;
      margin: 5px 0;
    }
  }

  /* Tablets */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 15px;

    .container {
      padding: 30px;
    }
  }

  /* Laptops */
  @media (min-width: 769px) and (max-width: 1024px) {
    .container {
      max-width: 700px;
    }
  }

  /* Large Desktops */
  @media (min-width: 1025px) {
    .container {
      max-width: 800px;
    }
  }
`;

export default AddEmployee;
