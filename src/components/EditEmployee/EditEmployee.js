import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const API_BASE_URL = "https://employeemanagement-server-p9xc.onrender.com";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    age: "",
    salary: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/emp/getEmployee/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setEmployeeData(data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/emp/updateEmployee/${id}`, {
        method: "PUT",
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

      const data = await response.json();

      if (response.ok) {
        alert("Employee updated successfully!");
        navigate("/dashboard");
      } else {
        throw new Error(data.message || "Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert(error.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <StyledWrapper>
      <div className="container">
        <h2>Edit Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
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
              Update Employee
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

  .loading,
  .error {
    text-align: center;
    padding: 20px;
    font-size: clamp(16px, 3vw, 18px);
  }

  .error {
    color: #d32f2f;
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

export default EditEmployee;
